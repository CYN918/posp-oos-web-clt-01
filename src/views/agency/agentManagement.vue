<template>
	<section>
	    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="mobile" placeholder="代理商手机号"></el-input>
				</el-form-item>	
				<el-form-item>
					<el-input v-model="agentName" placeholder="代理商名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="add">添加</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="agentLevel" label="代理商等级" width="130" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="名称" width="180" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="idCard" label="身份证号" width="180" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="加入时间" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="invitationCode" label="邀请码" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="parentName" label="上级代理" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="sumAgent" label="渠道数" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="sumSn" label="终端数" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sumActivation" label="激活数" width="150" sortable>
			</el-table-column>
			<el-table-column prop="sumAmount" label="总交易" width="150" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" :formatter="formatState" width="120" sortable>
			</el-table-column>
			<el-table-column
		      fixed="right"
		      label="操作"
		      width="320">
		      <template slot-scope="scope">
		        <el-button @click="freezes(scope.row)" type="text" size="small" v-if="scope.row.state === 1">冻结</el-button>
		        <el-button @click="freezes(scope.row)" type="text" size="small" v-if="scope.row.state === 10">解冻</el-button>
		        <el-button @click="setParam(scope.row)" type="text" size="small">设置分润参数</el-button>
		        <el-button @click="getParam(scope.row)" type="text" size="small">设置抵扣参数</el-button>
		        <el-button @click="handleClick(scope.row)" type="text" size="small">重置密码</el-button>
		      </template>
		    </el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" v-if="total != 0">
			<el-pagination
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-size="pageSize"
		      layout="prev, pager, next"
		      :total="total"
		      style="float:right;">
		    </el-pagination>
		</el-col>

		<!--新增代理商界面-->
		<el-dialog title="新增代理商" v-model="agentVisible" :close-on-click-modal="false">
			<el-form :data="agentForm" label-width="140px" ref="agentForm">
				<el-form-item label="营业执照名称" prop="agentName">
					<el-input v-model="agentForm.agentName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="注册号" prop="registrationNumber">
					<el-input v-model="agentForm.registrationNumber" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="法人姓名" prop="legalPersonName">
					<el-input v-model="agentForm.legalPersonName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="法人身份证" prop="legalPersonCard">
					<el-input v-model="agentForm.legalPersonCard" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="(对公账户信息)户名" prop="toPublicName">
					<el-input v-model="agentForm.toPublicName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="选择开户行" prop="bankName">
					<el-input v-model="bankName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="选择城市">
					<el-cascader
					    v-model="value"
					    :options="options"
					    ></el-cascader>
				</el-form-item>
				<el-form-item label="支行联行号" prop="paybankNo">
					<el-select v-model="paybankNo" placeholder="请选择支行联行号" @click.native="searchJones()">
					    <el-option
					      v-for="item in items"
					      :key="item.paybankNo"
					      :label="item.instName"
					      :value="item.paybankNo">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="银行账号" prop="account">
					<el-input v-model="agentForm.account" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="登录账号" prop="mobile">
					<el-input v-model="agentForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="登录账户名" prop="agentUserName">
					<el-input v-model="agentForm.agentUserName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="初始密码" prop="password">
					<el-input v-model="agentForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属机构" prop="agentLevel">
					<el-select v-model="agentLevel" placeholder="请选择">
					    <el-option
					      v-for="item in institutions"
					      @click.native="searchiIstitution()"
					      :key="item.agentLevel"
					      :label="item.label"
					      :value="item.agentLevel">
					    </el-option>
					</el-select>
					<el-select v-model="agentId" placeholder="请选择">
					    <el-option
					      v-for="item in takes"
					      :key="item.agentId"
					      :label="item.agentName"
					      :value="item.agentId">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属分公司" prop="parentFiliale">
					<el-input v-model="agentForm.parentFiliale" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="agentVisible = false">取消</el-button>
				<el-button type="primary" @click.native="agentSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--设置分润参数界面-->
		<el-dialog title="设置分润参数" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :data="addForm" label-width="120px" ref="addForm">
				<el-form-item label="政策" prop="policyId">
					<el-select v-model="policyId" placeholder="选择政策">
					    <el-option
					      v-for="item in policy"
					      :key="item.policyId"
					      :label="item.name"
					      :value="item.policyId"
					      @click.native="searchEcho()">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="代理商费率（刷卡支付）">
					<el-input v-model="addForm.agentRate" auto-complete="off"></el-input>
					<el-input v-model="addForm.agentFee" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户费率（刷卡支付）">
					<el-input v-model="addForm.txnRate" auto-complete="off"></el-input>
					<el-input v-model="addForm.txnFee" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="激活返现" prop="activationPrice">
					<el-input v-model="addForm.activationPrice" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="VIP返现(90天)" prop="vip90Price">
					<el-input v-model="addForm.vip90Price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="VIP返现(150天)" prop="vip150Price">
					<el-input v-model="addForm.vip150Price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动返现" prop="activityPrice">
					<el-input v-model="addForm.activityPrice" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--设置抵扣参数界面-->
		<el-dialog title="设置抵扣参数" v-model="deductionVisible" :close-on-click-modal="false">
			<el-form :data="deductionForm" label-width="120px" ref="deductionForm">
				<el-form-item label="分润" prop="txnRate">
					<el-input v-model="deductionForm.txnRate" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="激活返现" prop="activationRate">
					<el-input v-model="deductionForm.activationRate" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="VIP返现" prop="vipRate">
					<el-input v-model="deductionForm.vipRate" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动返现" prop="activityRate">
					<el-input v-model="deductionForm.activityRate" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="deductionVisible = false">取消</el-button>
				<el-button type="primary" @click.native="deductionSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
				agentName: '',
				users: [],
				total: '',
				bankLogId: '',
				listLoading: false,
				loading: false,
				pageSize: 10,
				currentPage: 1,
				token: localStorage.getItem('token'),
				addFormVisible: false,//新增界面是否显示
				agentVisible: false,
				deductionVisible: false,
				addForm: [],
				agentForm: [],
				deductionForm: [],
				addLoading: false,
				bankName: '',
				lists: [],
				value: [],
				options: [],
				paybankNo: '',
				items: [],
				policy: [],
				policyId: '',
				institutions: [
                   {
                     agentLevel: 0,
                     label: '请选择机构'

                   },
                   {
                     agentLevel: 1,
                     label: '机构'

                   },
                   {
                     agentLevel: 2,
                     label: '子机构'

                   },
                   {
                     agentLevel: 3,
                     label: '一级代理商'

                   }
				],
				agentLevel: '',
				takes: [],
				agentId: '',
				bankLogId: 0
			}
		},
		methods: {
		    formatState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '正常';
	            }else if (cellValue == "10"){
	                return '已冻结';
	            }
		    },
		    handleChange(value) {
		        console.log(value);
		    },
		    handleCurrentChange(val) {
				this.currentPage = val;	
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
			    var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
			            currentPage: this.currentPage,
                        pageSize: this.pageSize,
                        mobile: this.mobile,
                        agentName: this.agentName,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_001',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.users = response.body.BODY.rows;
	                    this.total = response.body.BODY.total;
	                    this.listLoading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.listLoading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                })
				
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			freezes(row) {
			    var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        mobile: row.mobile,
                        state: row.state,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_003',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.$message({
			              message: '成功',
			              type: 'success'
			            });
	                    this.listLoading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.listLoading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }else if(response.body.HEAD.CODE === '501'){
                        this.listLoading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			           
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                })
			},
			setParam(row) {
			    if(row.agentLevel === 1){
			        this.addFormVisible = true;
			        let agentId = row.agentId;
			        sessionStorage.setItem("agentId",agentId);
			    }else{
			        this.$message({
		                message: '您只能给一级代理商设置分润参数!',
		                type: 'warning'
		            });
			    }  
			},
			getParam(row) {
			    if(row.agentLevel === 1){
			        this.deductionVisible = true;
			        this.searchAgent(row);
			    }else{
			        this.$message({
		                message: '您只能给一级代理商设置抵扣参数!',
		                type: 'warning'
		            });
			    }   
			},
			handleClick(row) {
		        var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        mobile: row.mobile,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_005',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.$message({
			              message: '密码重置成功',
			              type: 'success'
			            });
	                    this.listLoading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.listLoading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }else if(response.body.HEAD.CODE === '501'){
                        this.listLoading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			           
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                })
		    },
		    add() {
                this.agentVisible = true;
		    },
		    addSubmit() {               	
				
			},
			agentSubmit() {
			   var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        mobile: row.mobile,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_009',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.$message({
			              message: '提交成功',
			              type: 'success'
			            });
	                    this.listLoading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.listLoading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }else if(response.body.HEAD.CODE === '501'){
                        this.listLoading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
                    } 
                })
                .catch(function(error) {
                    console.log(error);
                })
			},
			deductionSubmit() {

			},
			//解析城市json文件
			init() {		        
		        this.$http.get('http://localhost:8080/static/city.json').then(response => {   
			        let addressData = response.body.data;
			        let arr = [];
			        for (let i in addressData) {
			            let o = {};
					    o[i] = addressData[i];
					    arr.push(o)
			        }
			        let arr1 = [];
			        for(let i in arr){
			            arr1.push(arr[i]);
			        }
			        let addr=[];            
			        for(let item in arr1){ 
			            let key = arr1[item][item].name; 
			            let key1 = arr1[item][item].code; 
			            let keys = arr1[item][item].value;    
			            let cityList = [];
			            for(let item1 in keys){                   
			                let obj = {
			                    'value':keys[item1].code,
			                    'label':keys[item1].name,
			                }
			                cityList.push(obj)
			            }
			            let obj = {
			                'value':key1,
			                'label':key,
			                'children':cityList
			            }
			            addr.push(obj);
			            this.options = addr;
			        }
			        
			    }, response => {
			        console.log('数据加载失败')
			    })
		    },
		    //查询联行号
		    searchJones() {
		        var _this = this;
		        let cityCode = this.value
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        bankName: this.bankName,
                        cityCode: cityCode[0],
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_012',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.items = response.body.BODY.subBranchList;
	                    this.loading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }else if(response.body.HEAD.CODE === '501'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			           
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                })
		    },
		    //查询政策
		    searchPolicy() {
		        var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_007',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.policy = response.body.BODY.rows;
	                    this.loading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }else if(response.body.HEAD.CODE === '501'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			           
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                })
		    },
		    //根据政策查询是否设置过参数
		    searchEcho() {
		        var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        policyId: this.policyId,
                        agentId: sessionStorage.getItem("agentId"),
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_008',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        //此处写回显数据
	                    this.loading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }else if(response.body.HEAD.CODE === '501'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			           
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                })
		    },
		    //根据代理商查询是否设置过参数
		    searchAgent(row) {
                var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        agentId: row.agentId,
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_014',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        //此处写回显数据
                        if(response.body.BODY.res != null){
                            this.deductionForm = response.body.BODY.res;
	                        this.loading = false;
                        }else{
                            this.deductionForm = [];
	                        this.loading = false;
                        }
                    }else if(response.body.HEAD.CODE === '001'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }else if(response.body.HEAD.CODE === '501'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			           
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                })
		    },
		    //查询代理商
		    searchiIstitution() {
		        var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        agentLevel: this.agentLevel,
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_015',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        //此处写回显数据
                        this.takes = response.body.BODY.res;
	                    this.loading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }else if(response.body.HEAD.CODE === '501'){
                        this.loading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			           
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                })
		    }
		},
		mounted() {
			this.getUsers();
			this.init();
			this.searchPolicy();
		},
		created() {
			window.addEventListener('agentId', ()=> {
				this.agentId = sessionStorage.getItem('watchStorage');
			})
		}
	}

</script>

<style scoped>

</style>