<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="mobile" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="agentName" placeholder="名称"></el-input>
				</el-form-item>
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
			<el-table-column prop="versionId" label="ID" width="120" sortable>
			</el-table-column>
			<el-table-column prop="versionNum" label="版本号" width="100" sortable>
			</el-table-column>
			<el-table-column prop="url" label="更新地址" width="150" sortable>
			</el-table-column>
			<el-table-column prop="isForced" label="是否强制更新" width="150" sortable>
			</el-table-column>
			<el-table-column prop="record" label="描述" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="添加时间" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="intVersionNum" label="内部版本号" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="versionType" label="类型" min-width="180" sortable>
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
				<el-form-item label="版本号" prop="versionNum">
					<el-input v-model="addForm.versionNum" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="更新地址" prop="url">
					<el-input v-model="addForm.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否强制更新" prop="isForced">
					<el-select v-model="addForm.isForced">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="描述" prop="record">
					<el-input v-model="addForm.record" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="内部版本号" prop="intVersionNum">
					<el-input v-model="addForm.intVersionNum" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="versionType">
					<el-select v-model="addForm.versionType">
					    <el-option
					      v-for="item in lists"
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
		          label: '强制更新'
		        }, {
		          value: '10',
		          label: '不强制更新'
		        }],
		        lists: [{
		          value: '1',
		          label: 'ios'
		        }, {
		          value: '2',
		          label: '安卓'
		        }],			
				mobile: '',
				agentName: '',
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
                        mobile: this.mobile,
                        agentName: this.agentName,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'SYS_006',params).then(function(response) {
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
							this.$http.post(this.baseCont.JAVA_API + 'SYS_005',params).then(function(response) {
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