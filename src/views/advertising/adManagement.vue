<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="messageId" label="id" width="120" sortable>
			</el-table-column>
			<el-table-column prop="type" label="类型" width="100" sortable>
			</el-table-column>
			<el-table-column prop="toTarget" label="用户类型" width="150" sortable>
			</el-table-column>
			<el-table-column prop="title" label="标题" width="120" sortable>
			</el-table-column>
			<el-table-column prop="content" label="内容" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" min-width="180" sortable>
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
				<el-form-item label="类型" prop="type">
					<el-select v-model="addForm.type">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户类型" prop="toTarget">
					<el-select v-model="addForm.toTarget">
					    <el-option
					      v-for="item in lists"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="content">
					<el-input v-model="addForm.content" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="record">
					<el-input v-model="addForm.record" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="popup">
					<el-select v-model="addForm.popup">
					    <el-option
					      v-for="item in items"
					      :key="item.value"
					      :label="item.label"
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

		
	</section>
</template>

<script>
	export default {
		data() {
			return {
			    options: [{
		          value: '1',
		          label: '公告'
		        }, {
		          value: '2',
		          label: '推送消息'
		        }],
		        lists: [{
		          value: '1',
		          label: '商户'
		        }, {
		          value: '2',
		          label: '代理商'
		        }],
		        items: [{
		          value: '1',
		          label: '开始弹窗'
		        }, {
		          value: '10',
		          label: '关闭弹窗'
		        }],
				users: [],
				total: '',
				pageSize: 10,
				currentPage: 1,
				listLoading: false,
				sels: [],//列表选中列				
				editLoading: false,
				addFormVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
					type: '',
					toTarget: '',
					title: '',
					content: '',
					record: '',
					popup: '',
				},
				addFormRules: {
					type: [
						{ required: true, message: '请选择类型', trigger: 'blur' }
					],
					toTarget: [
						{ required: true, message: '请选择用户类型', trigger: 'blur' }
					],
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					],
					record: [
						{ required: true, message: '请输入描述', trigger: 'blur' }
					],
					popup: [
						{ required: true, message: '请选择状态', trigger: 'blur' }
					]
				},
				addLoading: false,
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
                this.$http.post(this.baseCont.JAVA_API + 'MSG_002',params).then(function(response) {
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
			handleAdd() {
			    this.addFormVisible = true;
				this.addForm = {
					type: '',
					toTarget: '',
					title: '',
					content: '',
					record: '',
					popup: '',
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
						        "HEAD":{"TOKEN":this.token},
						        "BODY": para
						    }
							this.$http.post(this.baseCont.JAVA_API + 'MSG_001',params).then(function(response) {
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
			selsChange: function (sels) {
				this.sels = sels;
			},
			
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>