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
			<el-table-column prop="policyCouponId" label="抵扣券ID" width="170" sortable>
			</el-table-column>
			<el-table-column prop="achieveAmount" label="面额(元)" width="150" sortable>
			</el-table-column>
			<el-table-column prop="validDay" label="有效天数(天)" width="250" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" :formatter="formatState" width="160" sortable>
			</el-table-column>
			<el-table-column prop="record" label="描述" min-width="180" sortable>
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
				<el-form-item label="面额" prop="achieveAmount">
					<el-input v-model="addForm.achieveAmount" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="有效天数" prop="validDay">
					<el-input v-model="addForm.validDay" auto-complete="off"></el-input>
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
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
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
                token: localStorage.getItem('token'),
				//新增界面数据
				addForm: [],
				addLoading: false,
				pageSize: 10,
				currentPage: 1,
				loading: false,
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
				state: '',
			}
		},
		methods: {
		    formatState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '上架';
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
                this.$http.post(this.baseCont.JAVA_API + 'COU_001',params).then(function(response) {
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
					this.$http.post(this.baseCont.JAVA_API + 'COU_002',params).then(function(response) {
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
		}
	}

</script>

<style scoped>

</style>