(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-4c1b99bc"],{"2f0c":function(t,e,a){"use strict";var n=a("7361");a.n(n).a},"333d":function(t,e,a){"use strict";var n={name:"Pagination",props:{small:{type:Boolean,default:!1},total:{required:!0,type:Number},page:{type:Number,default:1},background:{type:Boolean,default:!0},layout:{type:String,default:"prev, pager, next"},pageSize:{type:Number,default:10}},computed:{currentPage:{get:function(){return this.page},set:function(t){this.$emit("update:page",t)}}},methods:{handleClickPage:function(t){this.$emit("pagination",t)}}},i=(a("2f0c"),a("2877")),s=Object(i.a)(n,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"pagination-container"},[a("el-pagination",{attrs:{small:t.small,background:t.background,total:t.total,layout:t.layout,"page-size":t.pageSize,"current-page":t.currentPage},on:{"update:pageSize":function(e){t.pageSize=e},"update:page-size":function(e){t.pageSize=e},"update:currentPage":function(e){t.currentPage=e},"update:current-page":function(e){t.currentPage=e},"current-change":t.handleClickPage}})],1)}),[],!1,null,null,null);e.a=s.exports},"34d6":function(t,e,a){"use strict";var n=a("ff06");a.n(n).a},"3d2e":function(t,e,a){},7361:function(t,e,a){},a55c:function(t,e,a){"use strict";a.r(e);var n=a("365c"),i={props:{visible:{type:Boolean},params:Object},data:function(){return{isOpen:this.visible}},methods:{handleClose:function(){this.$emit("closeDialog",!1)},handleSuccess:function(t,e,a){this.sendMessage(t.msg)},sendMessage:function(t){"ok"===t?this.$message({type:"success",message:"已成功进行补录!"}):this.$message({type:"info",message:"操作失败"})}},watch:{visible:function(t){this.isOpen=t}}},s=(a("34d6"),a("2877")),o=(Object(s.a)(i,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{visible:t.isOpen,title:t.params.title},on:{"update:visible":function(e){t.isOpen=e},close:t.handleClose}},[a("div",{staticClass:"dialog-header clearfix"},[a("span",{staticClass:"download"},[t._v("下载模板："),a("a",{attrs:{href:"http://canteen.tonglingok.com/static/excel/template/补录管理模板.xlsx",download:""}},[t._v("补录管理模板.xls")])]),a("el-upload",{ref:"upload",staticClass:"upload-excel upload",attrs:{limit:t.params.limit,headers:t.params.header,"show-file-list":!1,accept:".xls,.xlsx",action:"http://canteen.tonglingok.comhttp://canteen.tonglingok.com/api/v1/wallet/supplement/upload","on-success":t.handleSuccess,name:"supplement"}},[a("el-button",{attrs:{type:"primary"}},[t._v("点击上传")])],1)],1)])}),[],!1,null,"3edf87ee",null).exports,a("4360")),l=a("333d"),c=a("575f");function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var d={data:function(){var t;return r(t={grade:o.a.getters.grade},"grade",3),r(t,"key",""),r(t,"company_ids",""),r(t,"companiesList",[]),r(t,"tableData",[]),r(t,"formdata",{canteen_id:"",consumption_date:"",dinner_id:"",money:"",remark:"",type:"1",staff_ids:""}),r(t,"canteenList",[]),r(t,"dinnersList",[]),r(t,"limit",1),r(t,"header",{token:o.a.getters.token}),r(t,"total",0),r(t,"current_page",1),t},created:function(){this.companiesVisible?this.getCompanies():this.fetchCanteenList()},computed:{companiesVisible:function(){return 3!==this.grade}},components:{Pagination:l.a},methods:{sendMessage:function(t){"ok"===t?this.$message({type:"success",message:"已成功进行补录!"}):this.$message({type:"info",message:"操作失败"})},queryList:function(){var t=this;console.log(this.current_page),n.a.get("http://canteen.tonglingok.com/api/v1/department/staffs/recharge?page=".concat(this.current_page,"&size=10&department_id=0&key=").concat(this.key)).then((function(e){t.tableData=Array.from(e.data.data)})).catch((function(t){return console.log(t)}))},getCompanies:function(){var t=this;n.a.get("http://canteen.tonglingok.com/api/v1/admin/companies").then((function(e){var a=e.data,n=Object(c.a)(a);t.companiesList=n})).catch((function(t){return console.log(t)}))},getCanteenList:function(t){this.fetchCanteenList(t),this.formdata.dinner_id="",this.formdata.canteen_id=""},fetchCanteenList:function(t){var e=this;t?n.a.get("http://canteen.tonglingok.com/api/v1/canteens?company_id=".concat(t)).then((function(t){e.canteenList=Array.from(t.data)})).catch((function(t){return console.log(t)})):n.a.get("http://canteen.tonglingok.com/api/v1/managerCanteens").then((function(t){e.canteenList=Array.from(t.data)})).catch((function(t){return console.log(t)}))},getDinnersList:function(t){var e=this;this.formdata.dinner_id="",t&&n.a.get("http://canteen.tonglingok.com/api/v1/canteen/dinners?canteen_id=".concat(t)).then((function(t){e.dinnersList=Array.from(t.data)})).catch((function(t){return console.log(t)}))},handleSelectionChange:function(t){var e=[];t.forEach((function(t){e.push(t.id)})),this.formdata.staff_ids=e.join(",")},confirmSupplement:function(){var t=this;n.a.post("http://canteen.tonglingok.com/api/v1/wallet/supplement",this.formdata).then((function(e){t.sendMessage(e.msg)})).catch((function(t){return console.log(t)}))},getList:function(t){this.current_page=t,this.queryList()},handleSuccess:function(t){this.sendMessage(t.msg)},handleError:function(t){}}},p=(a("fbd2"),Object(s.a)(d,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"supplement"},[a("div",{staticClass:"nav-title"},[t._v("补录管理")]),a("el-divider"),a("div",{staticClass:"main"},[a("div",{staticClass:"main-header"},[a("div",{staticClass:"select-title"},[a("span",{staticClass:"content-header"},[t._v("人员信息")]),a("el-input",{staticClass:"filter-input",staticStyle:{width:"200px"},attrs:{placeholder:"输入人员信息"},model:{value:t.key,callback:function(e){t.key=e},expression:"key"}}),a("el-button",{attrs:{type:"primary"},on:{click:t.queryList}},[t._v("查询")]),a("el-upload",{ref:"upload",staticClass:"upload-excel upload",attrs:{limit:t.limit,headers:t.header,"show-file-list":!1,accept:".xls,.xlsx",action:"http://canteen.tonglingok.comhttp://canteen.tonglingok.com/api/v1/wallet/supplement/upload","on-success":t.handleSuccess,"on-error":t.handleError,name:"supplement"}},[a("el-button",{attrs:{type:"primary"}},[t._v("批量补录")])],1)],1)]),a("div",{staticClass:"main-content"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,border:""},on:{"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),a("el-table-column",{attrs:{label:"公司",prop:"company"}}),a("el-table-column",{attrs:{label:"部门",prop:"department"}}),a("el-table-column",{attrs:{label:"姓名",prop:"username"}}),a("el-table-column",{attrs:{label:"员工编号",prop:"code"}}),a("el-table-column",{attrs:{label:"卡号",prop:"card_num"}})],1),a("pagination",{directives:[{name:"show",rawName:"v-show",value:t.total>10,expression:"total > 10"}],attrs:{total:t.total,page:t.current_page},on:{"update:page":function(e){t.current_page=e},pagination:t.getList}}),a("div",{staticClass:"supply-form"},[a("el-form",{attrs:{inline:!0,model:t.formdata,"label-width":"80px"}},[t.companiesVisible?a("el-form-item",{attrs:{label:"公司"}},[a("el-select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择公司"},on:{change:t.getCanteenList},model:{value:t.company_ids,callback:function(e){t.company_ids=e},expression:"company_ids"}},t._l(t.companiesList,(function(t){return a("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})})),1)],1):t._e(),a("el-form-item",{attrs:{label:"消费地点"}},[a("el-select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择消费地点"},on:{change:t.getDinnersList},model:{value:t.formdata.canteen_id,callback:function(e){t.$set(t.formdata,"canteen_id",e)},expression:"formdata.canteen_id"}},t._l(t.canteenList,(function(t){return a("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})})),1)],1),a("el-form-item",{attrs:{label:"消费日期"}},[a("el-date-picker",{staticStyle:{width:"200px"},attrs:{type:"datetime","value-format":"yyyy-MM-dd"},model:{value:t.formdata.consumption_date,callback:function(e){t.$set(t.formdata,"consumption_date",e)},expression:"formdata.consumption_date"}})],1),a("el-form-item",{attrs:{label:"消费餐次"}},[a("el-select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择消费餐次"},model:{value:t.formdata.dinner_id,callback:function(e){t.$set(t.formdata,"dinner_id",e)},expression:"formdata.dinner_id"}},t._l(t.dinnersList,(function(t){return a("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})})),1)],1),a("el-form-item",{attrs:{label:"消费金额"}},[a("el-input",{attrs:{placeholder:"请输入消费金额"},model:{value:t.formdata.money,callback:function(e){t.$set(t.formdata,"money",e)},expression:"formdata.money"}})],1),a("el-form-item",{attrs:{label:"备注"}},[a("el-input",{attrs:{placeholder:"请输入备注"},model:{value:t.formdata.remark,callback:function(e){t.$set(t.formdata,"remark",e)},expression:"formdata.remark"}})],1),a("div",{staticClass:"radio-area"},[a("el-radio",{attrs:{label:"1"},model:{value:t.formdata.type,callback:function(e){t.$set(t.formdata,"type",e)},expression:"formdata.type"}},[t._v("补充")]),a("el-radio",{attrs:{label:"2"},model:{value:t.formdata.type,callback:function(e){t.$set(t.formdata,"type",e)},expression:"formdata.type"}},[t._v("补扣")])],1)],1),a("div",{staticClass:"btn-area"},[a("el-button",{attrs:{type:"primary"}},[t._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:t.confirmSupplement}},[t._v("确定")])],1)],1)],1)])],1)])}),[],!1,null,null,null));e.default=p.exports},fbd2:function(t,e,a){"use strict";var n=a("3d2e");a.n(n).a},ff06:function(t,e,a){}}]);