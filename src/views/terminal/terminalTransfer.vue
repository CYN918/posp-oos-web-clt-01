<template>
	<section>
	    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-select v-model="policyId" placeholder="请选择政策类型">
				    <el-option
				      v-for="item in lists"
				      :key="item.policyId"
				      :label="item.name"
				      :value="item.policyId">
				    </el-option>
				</el-select>
				<el-select v-model="agentId" placeholder="请选择代理商">
				    <el-option
				      v-for="item in options"
				      :key="item.agentId"
				      :label="item.agentName"
				      :value="item.agentId">
				    </el-option>
				</el-select>
				<el-form-item>
					<el-input v-model="startSn" placeholder="序列号始"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="endSn" placeholder="序列号末"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="startSn" label="终端号始" width="200" sortable>
			</el-table-column>
			<el-table-column prop="endSn" label="终端号末" width="200" sortable>
			</el-table-column>
			<el-table-column prop="total" label="条数" width="150" sortable>
			</el-table-column>
			<el-table-column
		      fixed="right"
		      label="操作"
		      width="220">
		      <template slot-scope="scope">
		        <el-button @click="handleClick(scope.row)" type="text" size="small">移除</el-button>
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


		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" v-on:click="addModal">确认划拨</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--确认划拨界面-->
		<el-dialog title="创建保理" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :data="addForm" label-width="120px" ref="addForm">
				<el-form-item label="订单号" prop="orderNumber">
					<el-input v-model="addForm.orderNumber" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="接收代理商" prop="theAgent">
					<el-input v-model="addForm.theAgent" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="政策类型" prop="policyType">
					<el-input v-model="addForm.policyType" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="机具数量" prop="machinesTool">
					<el-input v-model="addForm.machinesTool" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="单价" prop="machinesPrice">
					<el-input v-model="addForm.machinesPrice" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="贷款总额" prop="loanAmount">
					<el-input v-model="addForm.loanAmount" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="保理总额" prop="amount">
					<el-input v-model="addForm.amount" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="期数" prop="amount">
					<el-select v-model="term" placeholder="请选择期数">
					    <el-option
					      v-for="(item,index) in items"
					      :key="index"
					      :label="index"
					      :value="index">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="每期金额" prop="eachAmount">
					<el-input v-model="addForm.eachAmount" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">创建保理</el-button>
			</div>
		</el-dialog>
				
	</section>
</template>

<script>
	export default {
		data() {
			return {
				lists: [],
				options: [],
				items: [],
				users: [],
				addForm: [],
				total: '',
				pageSize: 10,
				currentPage: 1,
				listLoading: false,
				sels: [],//列表选中列				
				editLoading: false,
				token: localStorage.getItem('token'),
				loading: false,
				policyId: '',
				agentId: '',
				startSn: '',
				endSn: '',
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				term: '',
			}
		},
		methods: {
			//政策列表查询
			loadPolicy() {
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
			            
			        }
			    }
                this.$http.post(this.baseCont.JAVA_API + 'POS_003',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.lists = response.body.BODY.rows;
	                    this.loading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.loading = false;
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
			//代理商列表查询
			loadPolicy() {
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
			            
			        }
			    }
                this.$http.post(this.baseCont.JAVA_API + 'POS_004',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.options = response.body.BODY.rows;
	                    this.loading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.loading = false;
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
			//获取用户列表
			getUsers() {
			    var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
			            agentId: this.agentId,
                        policyId: this.policyId,
                        startSn: this.startSn,
                        endSn: this.endSn,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'POS_005',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.users = response.body.BODY.posList;
	                    //this.total = response.body.BODY.total;
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
			handleClick(row) {
			    console.log(row)
		    },
		    addModal() {
		        this.addFormVisible = true;
		    },
		    //创建保理
			addSubmit() {               		
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.addLoading = true;
					
					let para = Object.assign({}, this.addForm);
					let params = {
				        "HEAD":{"token":this.token},
				        "BODY": para
				    }
					this.$http.post(this.baseCont.JAVA_API + 'POS_012',params).then(function(response) {
	                    this.addLoading = false;
	                    this.$message({
							message: '提交成功',
							type: 'success'
						});
						this.$refs['addForm'].resetFields();
						this.addFormVisible = false;
						this.getUsers();
	                })
	                .catch(function(error) {
	                    console.log(error);
	                })
				});
					
				
			},

		},
		mounted() {
			
		}
	}

</script>

<style scoped>

</style>