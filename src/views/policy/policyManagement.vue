<template>
	<section>
	    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
			    <el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="add">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="name" label="政策名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" :formatter="formatState" width="150" sortable>
			</el-table-column>
			<el-table-column prop="record" label="描述" width="250" sortable>
			</el-table-column>
			<el-table-column prop="jhRecord" label="激活描述" width="160" sortable>
			</el-table-column>
			<el-table-column prop="hdRecord" label="活动描述" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="yhRecord" label="优惠描述" min-width="180" sortable>
			</el-table-column>
			<el-table-column
		      fixed="right"
		      label="操作"
		      width="120">
		      <template slot-scope="scope">
		        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
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



		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :data="addForm" label-width="120px" ref="addForm">
				<el-form-item label="政策名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="激活返现" prop="policyActivationId">
					<el-select v-model="policyActivationId" placeholder="请选择激活返现">
					    <el-option
					      v-for="item in options"
					      :key="item.policyActivationId"
					      :label="item.record"
					      :value="item.policyActivationId">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="优惠券" prop="policyCouponId">
					<el-select v-model="policyCouponId" placeholder="请选择优惠券">
					    <el-option
					      v-for="item in lists"
					      :key="item.policyCouponId"
					      :label="item.record"
					      :value="item.policyCouponId">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动返现" prop="policyActivityId">
					<el-select v-model="policyActivityId" placeholder="请选择活动返现">
					    <el-option
					      v-for="item in items"
					      :key="item.policyActivityId"
					      :label="item.record"
					      :value="item.policyActivityId">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择状态" prop="state">
					<el-select v-model="state" placeholder="请选择状态">
					    <el-option
					      v-for="item in datas"
					      :key="item.value"
					      :label="item.name"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="描述" prop="record">
					<el-input v-model="addForm.record" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="默认价格" prop="posPrice">
					<el-input v-model="addForm.posPrice" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最小价格" prop="posPriceMin">
					<el-input v-model="addForm.posPriceMin" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最大价格" prop="posPriceMax">
					<el-input v-model="addForm.posPriceMax" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="默认费率" prop="rate">
					<el-input v-model="addForm.rate" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最小费率" prop="rateMin">
					<el-input v-model="addForm.rateMin" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最大费率" prop="rateMax">
					<el-input v-model="addForm.rateMax" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否购买VIP" prop="isBuyVip">
					<el-select v-model="isBuyVip" placeholder="是否购买VIP">
					    <el-option
					      v-for="item in vips"
					      :key="item.value"
					      :label="item.name"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--修改政策界面-->
		<el-dialog title="修改政策" v-model="addFormVisibles" :close-on-click-modal="false">
			<el-form :data="addForms" label-width="120px" ref="addForms" v-loading="loading">
				<el-form-item label="政策名称" prop="name">
					<el-input v-model="addForms.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="record">
					<el-input v-model="addForms.record" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="默认价格" prop="posPrice">
					<el-input v-model="addForms.posPrice" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最小价格" prop="posPriceMin">
					<el-input v-model="addForms.posPriceMin" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最大价格" prop="posPriceMax">
					<el-input v-model="addForms.posPriceMax" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="默认费率" prop="rate">
					<el-input v-model="addForms.rate" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最小费率" prop="rateMin">
					<el-input v-model="addForms.rateMin" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最大费率" prop="rateMax">
					<el-input v-model="addForms.rateMax" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否购买VIP" prop="isBuyVip">
					<el-select v-model="isBuyVip" placeholder="是否购买VIP">
					    <el-option
					      v-for="item in vips"
					      :key="item.value"
					      :label="item.name"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisibles = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmits" :loading="addLoading">确定修改</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	export default {
		data() {
			return {
				users: [],
				total: '',
				listLoading: false,
				addFormVisible: false,//新增界面是否显示
				addFormVisibles: false,//新增界面是否显示
				options: [],
				policyActivationId: '',
				lists: [],
				policyCouponId: '',
				items: [],
				policyActivityId: '',
				datas: [
                    {
                       value: 1,
                       name: '上架',
                    },
                    {
                       value: 10,
                       name: '下架',
                    }
				],
				vips: [
                    {
                       value: 1,
                       name: '可购买',
                    },
                    {
                       value: 10,
                       name: '不可购买',
                    }
				],
				isBuyVip: '',
				state: '',
                token: localStorage.getItem('token'),
				//新增界面数据
				addForm: [],
				addLoading: false,
				pageSize: 10,
				currentPage: 1,
				loading: false,
				addForms: [],
			}
		},
		methods: {
		    formatState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '正常';
	            }else if (cellValue == "10"){
	                return '下架'
	            }
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
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'PLC_001',params).then(function(response) {
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
			add() {
                this.addFormVisible = true;
			},
			//激活返现列表查询
			jhActivate() {
                var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'ACT_001',params).then(function(response) {
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
			//优惠券列表
			yhCoupons() {
			    var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'COU_001',params).then(function(response) {
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
			//活动返现列表查询
			hdActivity() {
			    var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'ITY_001',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.items = response.body.BODY.rows;
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

			//新增
			addSubmit() {               	
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.addLoading = true;
					//NProgress.start();
					let para = Object.assign({}, this.addForm);
					let params = {
				        "HEAD":{"TOKEN":this.token},
				        "BODY": para
				    }
					this.$http.post(this.baseCont.JAVA_API + 'PLC_002',params).then(function(response) {
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
			//修改政策
			handleClick(row) {
			   this.addFormVisibles = true;
			   this.addForms = row;
			},
			//修改政策提交
			addSubmits() {               	
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.addLoading = true;
					//NProgress.start();
					let para = Object.assign({}, this.addForm);
					let params = {
				        "HEAD":{"TOKEN":this.token},
				        "BODY": para
				    }
					this.$http.post(this.baseCont.JAVA_API + 'PLC_002',params).then(function(response) {
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
			this.getUsers();
			this.jhActivate();
			this.yhCoupons();
			this.hdActivity();
		}
	}

</script>

<style scoped>

</style>