<template>
  <el-table
    :data="data"
    @selection-change="selectionChange"
    @sort-change="sortChange"
    :highlight-current-row="highlightRow"
    :row-class-name="tableRowClassName"
    :border="border"
    ref="table"
    size="medium"
    :max-height="maxHeight"
  >
    <el-table-column
      v-if="selection"
      type="selection"
      :selectable="selectable"
      fixed
      :reserve-selection="reserveSelection"
      :align="align"
      width="50"
    ></el-table-column>
    <el-table-column
      v-if="index"
      label="序号"
      type="index"
      :align="align"
      width="60"
    ></el-table-column>
    <el-table-column
      v-for="(item, index) of tableColumnData"
      :key="index"
      :align="align"
      resizable
      :min-width="minWidth ? minWidth : ''"
      :show-overflow-tooltip="!item.unShowOverFlow"
      :width="item.width ? item.width : ''"
      :prop="item.prop"
      :sortable="item.sortable ? 'custom' : false"
      :formatter="item.formatter"
      :label-class-name="item.labelClassName"
      :fixed="item.fixed"
      :label="item.label"
    >
      <span v-if="item.isCustomHeader">
        {{ item.label }}
        <el-tooltip
          v-if="item.tipsInfo && item.tipsInfo.length"
          class="item"
          effect="dark"
          placement="bottom"
        >
          <div slot="content">
            <div v-for="(info, i) of item.tipsInfo" :key="i">{{ info }}</div>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </span>
      <span v-else-if="item.headerMessage">
        {{ item.label }}
        <span class="header-message">{{ item.message }}</span>
      </span>
      <span v-else-if="item.headerTips && item.tipMessage">
        {{ item.label }}
        <el-tooltip class="item" effect="dark" placement="right">
          <div slot="content">
            <span v-for="(tip, index) in item.tipMessage" :key="index">
              {{ tip }}
              <br v-if="index !== item.tipMessage.length" />
            </span>
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </span>
      <el-table-column
        v-else-if="item.column"
        v-for="(inItem, index) in item.column"
        :key="index"
        :prop="inItem.prop"
        :label="inItem.label"
        :align="align"
        resizable
        :min-width="minWidth ? minWidth : ''"
        :show-overflow-tooltip="!inItem.unShowOverFlow"
        :width="inItem.width ? inItem.width : ''"
        :sortable="inItem.sortable ? 'custom' : false"
        :formatter="inItem.formatter"
        :label-class-name="inItem.labelClassName"
        :fixed="inItem.fixed"
      >
        <template slot-scope="scope">
          <div
            v-if="inItem.type === 'CUSTOM'"
            @mouseenter="hoverTrIndex(scope)"
          >
            <slot :name="inItem.prop" :scope="scope"></slot>
          </div>
          <!-- <span v-else>{{ scope.row[inItem.prop] }}</span> -->
          <span v-else>{{ getCellValue(scope.row, inItem.prop) }}</span>
        </template>
      </el-table-column>
      <span v-else>{{ item.label }}</span>
      <template slot-scope="scope">
        <span
          v-if="item.type === 'LINK' && !unLink"
          @click="click(scope.row, item.prop)"
          class="common-table-click pointer"
          >{{ scope.row[item.prop] }}</span
        >
        <div v-else-if="item.type === 'OPERATE'" class="common-table-control">
          <div
            v-for="(value, index) of item.controls"
            :key="index"
            class="common-table-click pointer"
            @click="clickcontrol(scope.row, value.prop)"
          >
            <p v-if="!value.disappear">{{ `${value.label}` }}</p>
          </div>
        </div>
        <span v-else-if="item.type === 'DATETIME'">
          {{ dateTime(scope.row[item.prop]) }}
        </span>
        <span v-else-if="item.type === 'DATE'">
          {{ date(scope.row[item.prop]) }}
        </span>
        <span v-else-if="item.type === 'MONEY'">
          {{ dealWithMoney(scope.row[item.prop]) }}
        </span>
        <span v-else-if="item.type === 'AREA'">
          {{ scope.row[item.prop] | areaFormat }}
        </span>
        <span v-else-if="item.type === 'DATEPERIOD'">
          {{ scope.row[item.prop].join("-") }}
        </span>
        <div
          v-else-if="item.type === 'CUSTOM'"
          @mouseenter="hoverTrIndex(scope)"
        >
          <slot :name="item.prop" :scope="scope"></slot>
        </div>
        <span v-else-if="item.type === 'ENUM'">
          {{ scope.row[item.prop] ? scope.row[item.prop].name : "" }}
        </span>
        <span v-else-if="item.type === 'BOOLEAN'">
          {{ transferNumberToBool(scope.row[item.prop]) }}
        </span>
        <span v-else-if="item.type === 'ARRAY'">
          {{ scope.row[item.prop].join(item.divide || "/") }}
        </span>
        <span v-else-if="item.type === 'HOUR'">
          <!-- {{ (scope.row[item.prop] / 60.0).toFixed(1) }} -->
          {{
            `${parseInt(scope.row[item.prop] / 60, 10)}时${(
              scope.row[item.prop] % 60
            ).toFixed(0)}分`
          }}
        </span>
        <span v-else-if="item.type === 'SCORE'">
          {{ (scope.row[item.prop] / 100.0).toFixed(2) }}
        </span>
        <span
          v-else-if="item.type === 'APPROVESTATUS'"
          class="dot blue"
          :class="color[scope.row[item.prop].id]"
          >{{ scope.row[item.prop].name }}</span
        >
        <!-- <span v-else style="width:200px">{{ scope.row[item.prop] }}</span> -->
        <span v-else>{{
          getCellValue(scope.row, item.prop, item.formatter)
        }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { get } from "lodash";
/**
 * @file 自定义通用table组件
 * @author jiangjun
 *
 * @description
 * 字段type LINK : 可点击
 *         OPERATE : 操作
 *         DATE : 日期
 *         DATETIME : 日期时间
 *         MONEY : 钱
 *         PIC&LINK : 带图片，可点击
 *         CUSTOM : 自定义，需传递slot，自定义样式中，已将表格数据scope传递，接收方需使用 slot-scope="{ scope }"来接收表格当前行数据
 * 其他为默认样式，不传type
 *
 * @prop {array} tableColumnData 表头配置
 *       [{ label: '', prop: '', 'type': '', controls: [{label:'操作项时才需要', prop: '', disappear: boolean}]}]
 * @prop {array} data 数据
 * @prop {boolean} selection 是否显示选择器
 * @prop {boolean} index 是否显示索引 *
 * @prop {function} selectable 选择器显示规则
 *
 * @event clicklink 表格内可点击的事件 回传（value: object, prop: string)：当前行的数据value，当前列的prop
 * @event clickcontrol 操作栏点击事件 回传（value: object, prop: string)：当前行的数据value，操作项的prop
 * @event selectionChange selection点击回传事件 回传(value: array)：选中的数据数组
 * @event sortChange 排序点击回传事件 回传(prop: string, type: number)：需要回传的porp，type: 升序（1）/降序（2）
 */

// 排序时回传排序状态映射
const orderType = {
  ascending: 1,
  descending: 2,
};

export default {
  name: "CommonTable",
  props: {
    tableColumnData: {
      type: Array,
      default: () => [],
    },
    selection: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Boolean,
      default: false,
    },
    // indexFixed: {
    //   type: String | Boolean,
    //   default: "left",
    // },
    data: {
      type: Array,
      // 输入属性为对象或数组的时候需要使用此种方式
      default: () => [],
    },
    highlightRow: {
      type: Boolean,
      default: true,
    },
    maxHeight: {
      type: Number,
      default: null,
    },
    minWidth: {
      type: String,
      default: "",
    },
    selectable: {
      type: Function,
      default: () => {
        return true;
      },
    },
    border: {
      type: Boolean,
      default: false,
    },
    reserveSelection: {
      type: Boolean,
      default: false,
    },
    unLink: {
      type: Boolean,
      default: false,
    },
    tableRowClassName: {
      type: Function,
      default: () => "",
    },
    align: {
      type: String,
      default: "left",
    },
  },
  data() {
    return {
      color: {
        2: "yellow",
        3: "green",
        4: "red",
        7: "red",
      },
    };
  },
  methods: {
    click(value, prop) {
      this.$emit("clicklink", value, prop);
    },
    clickcontrol(value, prop) {
      this.$emit("clickcontrol", value, prop);
    },
    selectionChange(value) {
      this.$emit("selectionChange", value);
    },
    sortChange(val) {
      this.$emit("sortChange", val.prop, orderType[val.order]);
    },
    dateTime(value) {
      if (value && value !== "--") {
        return this.$formatDate(value, "yyyy-MM-dd HH:mm:ss");
      } else {
        return "-";
      }
    },
    transferNumberToBool(value) {
      if (value == 0 || value == false) {
        return "否";
      } else if (value == 1 || value == true) {
        return "是";
      } else {
        return "--";
      }
    },
    date(value) {
      if (value && value !== "--") {
        return this.$formatDate(value, "yyyy-MM-dd");
      } else {
        return "-";
      }
    },
    // 用于切换选中的项
    toggleRowSelection(row, value) {
      this.$refs.table.toggleRowSelection(row, value);
    },
    // selectable(row, index) {
    //     console.log('commontable', row, index)
    // }
    dealWithMoney(value) {
      if (!value) {
        return "--";
      } else {
        return this.$options.filters.currency(
          this.$options.filters.unitMoney(value, 10000),
          "￥",
          2
        );
      }
    },
    getCellValue(item, path, formatter) {
      const EMPTY_PLACEHOLDER = "--";
      let safeValue = get(item, path, EMPTY_PLACEHOLDER);
      return formatter
        ? safeValue !== EMPTY_PLACEHOLDER
          ? formatter(safeValue)
          : safeValue
          ? safeValue
          : "--"
        : safeValue !== "" && safeValue !== null
        ? safeValue
        : "--";
    },
    // hover确定当前的tr下标
    hoverTrIndex(scope) {
      this.$emit("hoverTrIndex", scope);
    },
  },
};
</script>
