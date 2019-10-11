<template>
	<section>
	    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" v-on:click="add">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="factoryId" label="厂商id" width="120" sortable>
			</el-table-column>
			<el-table-column prop="factoryNo" label="厂商编号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="factoryName" label="厂商名称" width="250" sortable>
			</el-table-column>
			<el-table-column prop="posModel" label="支持终端型号" width="160" sortable>
			</el-table-column>
			<el-table-column prop="posName" label="终端名称" min-width="180" sortable>
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
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="厂商编号" prop="factoryNo">
					<el-input v-model="addForm.factoryNo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="厂商名称" prop="factoryName">
					<el-input v-model="addForm.factoryName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="支持终端型号" prop="posModel">
					<el-input v-model="addForm.posModel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="终端名称" prop="posName">
					<el-input v-model="addForm.posName" auto-complete="off"></el-input>
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
				//新增界面数据
				addForm: {
					factoryNo: '',
					factoryName: '',
					posModel: '',
					posName: '',
				},
				addFormRules: {
					factoryNo: [
						{ required: true, message: '请输入厂商编号', trigger: 'blur' }
					],
					factoryName: [
						{ required: true, message: '请输入厂商名称', trigger: 'blur' }
					],
					posModel: [
						{ required: true, message: '请输入支持终端型号', trigger: 'blur' }
					],
					posName: [
						{ required: true, message: '请输入终端名称', trigger: 'blur' }
					]
				},
				addLoading: false,
				pageSize: 10,
				currentPage: 1,
				token: localStorage.getItem('token'),
			}
		},
		methods: {
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
                this.$http.post(this.baseCont.JAVA_API + 'POS_009',params).then(function(response) {
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
				this.addForm = {
					factoryNo: '',
					factoryName: '',
					posModel: '',
					posName: '',
				};
			},
			//新增
			addSubmit() {               
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							let params = {
						        "HEAD":{"token":this.token},
						        "BODY": para
						    }
							this.$http.post(this.baseCont.JAVA_API + 'POS_009',params).then(function(response) {
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
					}
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