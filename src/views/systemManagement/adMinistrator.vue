<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="name" placeholder="名称"></el-input>
				</el-form-item>
				<el-select v-model="value" placeholder="请选择状态">
				    <el-option
				      v-for="item in datas"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="adminId" label="管理员编号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="name" label="名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="150" sortable>
			</el-table-column>
			<el-table-column prop="record" label="描述" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="creator" label="创建人" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="operator" label="修改人" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="operationTime" label="修改时间" min-width="180" sortable>
			</el-table-column>
			<el-table-column
		      fixed="right"
		      label="操作"
		      width="120">
		      <template slot-scope="scope">
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

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="addForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="state">
					<el-select v-model="addForm.state">
					    <el-option
					      v-for="item in datas"
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
		        datas: [{
		          value: '1',
		          label: '正常'
		        }, {
		          value: '10',
		          label: '锁定'
		        }],
		        name: '',	
		        value: '',		
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
					versionNum: '',
					url: '',
					isForced: '',
					record: '',
					intVersionNum: '',
					versionType: '',
				},
				addFormRules: {
					versionNum: [
						{ required: true, message: '请输入版本号', trigger: 'blur' }
					],
					url: [
						{ required: true, message: '请输入更新地址', trigger: 'blur' }
					],
					isForced: [
						{ required: true, message: '请选择是否强制更新', trigger: 'blur' }
					],
					record: [
						{ required: true, message: '请输入描述', trigger: 'blur' }
					],
					intVersionNum: [
						{ required: true, message: '请输入内部版本号', trigger: 'blur' }
					],
					versionType: [
						{ required: true, message: '请选择类型', trigger: 'blur' }
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
                        name: this.name,
                        state: this.value,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'SYS_009',params).then(function(response) {
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
					versionNum: '',
					url: '',
					isForced: '',
					record: '',
					intVersionNum: '',
					versionType: '',
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
							this.$http.post(this.baseCont.JAVA_API + 'SYS_007',params).then(function(response) {
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
			handleClick(row) {
		        var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        adminId: row.adminId,
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'SYS_008',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.$message({
			              message: '密码重置成功',
			              type: 'success'
			            });
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
			
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>