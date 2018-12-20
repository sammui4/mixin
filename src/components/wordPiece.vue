<template>

  <div class="app">
    <div class="globalContent">
        <hkm-table
          :records="records"
          ref="table"
          :head-contextmenu="['freeze_line_left', 'freeze_line_right', 'unfreeze_line', 'hide_line']"
          :body-contextmenu="['copy', 'freeze_row', 'unfreeze_row']"
          @select="selectLink">

          <hkm-table-column
            v-for="(column, i) in columns"
            :key="i"
            :label="column.label"
            :type="column.type"
            :width="column.width"
            :fixed="column.fixed"
            :prop="column.prop"
            :align="column.align"
            :sortable="column.sortable"
            :resizable="column.resizable"
            :editable="column.editable">
            <!-- <template slot-scope="{row, column}">
              {{renderCell(row, column)}}
            </template> -->
          </hkm-table-column>

        </hkm-table>
    </div>
  </div>

</template>

<script>
export default {
  name:'wordPiece',

  created(){
    var obj = {"createUserId":7255022,"createTime":1544774693000,"modifyUserId":7255022,"modifyTime":1544774702000,"accountSet":1,"state":"10A","createUserName":null,"modifyUserName":"肖羚","backup1":null,"backup2":null,"backup3":null,"backup4":null,"backup5":null,"contentId":525100,"oldid":null,"purchaseId":525100,"purchaseOrderCode":"CGG0745181214001","contentBrandId":null,"contractCode":null,"contractType":null,"inventoryCode":"C18092700003","inventoryId":1240102,"inventoryName":"1060","purchaseUnit":"num","starUsingBatch":"1","varietyId":1250100,"varietyName":"1系铝","brandId":1240100,"brandName":"1060","statusId":1240101,"statusName":"H24","thickness":0.2,"width":1000.0,"length":null,"specificationModel":"0.2*1000","mainMeasurementUnit":"KG","number":6500.0,"unitPrice":0.01,"systemPrice":0.0,"amount":65.0,"marketDate":1544745600000,"arrivalDate":null,"thicknessTolerance":"-0.001/+0.1","widthTolerance":null,"lengthTolerance":null,"hardnessTolerance":null,"tensileTolerance":null,"weightTolerance":null,"elongationTolerance":null,"custcode":null,"custname":null,"warehouse":null,"transportMode":null,"remark":null,"basePrice":0.0,"lossCost":0.0,"processCost":0.0,"specChange":0.0,"contractChange":0.0,"priceChange":0.0,"businessStatus":"EXE","closeUserId":null,"closeUserName":null,"closeTime":null,"closeReason":null,"closeRemark":null,"statusPrice":0.0,"thicknessPrice":0.0,"widthPrice":0.0,"lengthPrice":0.0,"workUnitPrice":0.0,"freightUnitPrice":0.0,"useUnitPrice":0.0,"useType":"press","onWayNum":0.0,"arrivalNum":6450.0,"orderDate":1544716800000,"lastarrival":1544716800000,"surplusNum":50.0,"custsortname":"明泰C","pricingMode":"hp","exportOrderdate":null,"exportArrivaldate":null,"exportlastArrival":null,"exportClosedate":null}
    for(let i=0;i<500;i++){
      this.records.push(obj)
    }
  },
  data(){
    return {
      // 表头数据信息
      columns: [
        {
          type: 'selection',
          width: 40,
          fixed: 'left'
        },
        {
          label: "销售单号",
          prop: "saleOrderCode",
          width: "150",
        },
        {
          label: "下单日期",
          prop: "baseOrderDate",
          width: "100",
        },
        {
          label: "客户简称",
          prop: "baseCustsortname",
          width: "120",
          align: "left"
        },
        {
          label: "客户订单号",
          prop: "orderCode",
          width: "120",
        },
        {
          label: "牌号",
          prop: "brandNameCode",
          width: "60",
        },
        {
          label: "厚度公差",
          prop: "thicknessTolerance",
          width: "80",
          align: "right"
        },
        {
          label: "宽度公差",
          prop: "widthTolerance",
          width: "80",
          align: "right"
        },
        {
          label: "长度公差",
          prop: "lengthTolerance",
          width: "80",
          align: "right"
        },
        {
          label: "状态",
          prop: "stateName",
          width: "120",
        },
        {
          label: "销售单价",
          prop: "saleUnitPrice",
          width: "80",
          align: "right"
        },
        {
          label: "累计送货数量",
          prop: "totalDeliveryNum",
          width: "100",
          align: "right"
        },
        {
          label: "待送货数量",
          prop: "deliveryNum",
          width: "100",
          align: "right"
        },
        {
          label: "业务类型",
          prop: "baseBusinessType",
          width: "100",
        },
        {
          label: "业务员",
          prop: "baseBuyername",
          width: "100",
          align: "left"
        },
        {
          label: "送货日期",
          prop: "deliveryDate",
          width: "100",
        },
        {
          label: "要求到货日期",
          prop: "arrivalDate",
          width: "100",
        },
        {
          label: "存货名称",
          prop: "inventoryName",
          width: "80",
        },
        {
          label: "品种",
          prop: "varietyName",
          width: "80",
        },
        {
          label: "规格型号",
          prop: "specificationModel",
          width: "80",
        },
        {
          label: "产品用途",
          prop: "useType",
          width: "100",
        },
        {
          label: "计量单位",
          prop: "mainUnitCode",
          width: "80",
        },
        {
          label: "数量",
          prop: "tatalNum",
          width: "80",
          align: "right"
        },
        {
          label: "待处理数量",
          prop: "pendingNum",
          width: "100",
          align: "right"
        },
        {
          label: "生产中数量",
          prop: "producingNum",
          width: "100",
          align: "right"
        },
        {
          label: "销售金额",
          prop: "baseSalePrice",
          width: "80",
          align: "right"
        },
        {
          label: "加工单价",
          prop: "workUnitPrice",
          width: "80",
          align: "right"
        },
        {
          label: "加工金额",
          prop: "workPrice",
          width: "80",
          align: "right"
        },
        {
          label: "送货方式",
          prop: "deliveryMode",
          width: "80",
        },
        {
          label: "硬度范围",
          prop: "hardnessRange",
          width: "80",
          align: "right"
        },
        {
          label: "抗拉强度",
          prop: "tensileRange",
          width: "80",
          align: "right"
        },
        {
          label: "延伸率",
          prop: "elongationRange",
          width: "80",
          align: "right"
        },
        {
          label: "单重范围",
          prop: "weightRange",
          width: "80",
          align: "right"
        },
        {
          label: "内径",
          align: "right",
          prop: "interDiameter",
          width: "80",
        },
        {
          label: "外径",
          prop: "outerDiameter",
          width: "80",
          align: "right"
        },
        {
          label: "包装方式",
          prop: "packingMethod",
          width: "100",
          align: "left"
        },
        {
          label: "检查要求",
          prop: "inspectRequire",
          width: "100",
          align: "left"
        },
        {
          label: "品质资料",
          prop: "qualityDataqualityData",
          width: "120",
          align: "left"
        },
        {
          label: "供应商",
          prop: "supplierSortName",
          width: "120",
          align: "left"
        },
        {
          label: "销售合同",
          prop: "saleOrderCode",
          width: "160",
        },
        {
          label: "客户料号",
          prop: "custMaterial",
          width: "100",
        },
        {
          label: "备注",
          prop: "remark",
          width: "120",
          align: "left"
        },
        {
          label: "进度状态",
          prop: "businessStatus",
          width: "80",
        },
        {
          label: "关闭人",
          prop: "closeUserName",
          width: "80",
        },
        {
          label: "关闭时间",
          prop: "closeTime",
          width: "130",
        },
      ],
      records:[],
      selectLink:[]
    }
  }
}
</script>

<style>

</style>
