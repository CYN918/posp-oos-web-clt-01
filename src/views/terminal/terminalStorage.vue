<template>
	<section>
		<!--工具条-->
		<el-upload
		  class="upload-demo"
		  ref="upload"
		  action="http://10.10.34.115:8081/POS_007"
		  name='idPicture'
		  :limit='1'
		  :on-preview="handlePreview"
		  :on-remove="handleRemove"
		  :on-success="handleSuccess"
		  :on-error="handleError"
		  :file-list="fileList"
		  :auto-upload="false">
		  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
		  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
		  <div slot="tip" class="el-upload__tip">只能上传txt文件，且不超过10M</div>
		</el-upload>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="star" placeholder="序列号始"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="end" placeholder="序列号末"></el-input>
				</el-form-item>
				<el-select v-model="value" placeholder="请选择政策类型">
				    <el-option
				      v-for="item in options"
				      :key="item.policyId"
				      :label="item.name"
				      :value="item.policyId">
				    </el-option>
				</el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">确定入库</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="prefix" label="前缀" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sn15" label="序列号" width="160" sortable>
			</el-table-column>
			<el-table-column prop="random" label="随机位" width="100" sortable>
			</el-table-column>
			<el-table-column prop="secretKey" label="密钥" width="180" sortable>
			</el-table-column>
			<el-table-column prop="salt" label="盐钥" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="factoryName" label="厂商名称" min-width="190" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" min-width="180" :formatter="formatState" sortable>
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

		

		
	</section>
</template>

<script>
	export default {
		data() {
			return {
			    options: [],
		        value: '',
			    fileList: [],				
				star: '',
				end: '',
				users: [],
				total: '',
				pageSize: 10,
				currentPage: 1,
				listLoading: false,
				sels: [],//列表选中列				
				editLoading: false,
				token: localStorage.getItem('token'),
				loading: false,
			}
		},
		methods: {
		    formatState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '已设置';
	            }else if (cellValue == "10"){
	                return '未设置';
	            }
		    },
		    handleCurrentChange(val) {
				this.currentPage = val;	
				this.getUsers();
			},
		    submitUpload() {
		        this.$refs.upload.submit();   
		    },
		    handleSuccess() {
                this.$message({
		          message: '上传成功',
		          type: 'success'
		        });
		        this.getUsers();
		    },
		    handleError() {
                this.$message.error(response.body.HEAD.MSG);
		    },
		    handleRemove(file, fileList) {
		        console.log(file, fileList);
		    },
		    handlePreview(file) {
		        console.log(file);
		    },
			//获取用户列表
			getUsers() {
			    var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
			            currentPage: this.currentPage,
                        pageSize: this.pageSize,
                        startSn: this.star,
                        endSn: this.end,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'POS_001',params).then(function(response) {
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
			//获取政策列表
			loadPolicy() {
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
			            
			        }
			    }
                this.$http.post(this.baseCont.JAVA_API + 'AGT_007',params).then(function(response) {
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
			handleAdd() {
			    if(this.star == ''){
                    this.$message({
			          message: '请输入序列号始',
                      type: 'warning'
			        });
			        return false
                }
                if(this.end == ''){
                    this.$message({
			          message: '请输入序列号末',
                      type: 'warning'
			        });
			        return false
                }
                if(this.value == ''){
                    this.$message({
			          message: '请选择政策',
                      type: 'warning'
			        });
			        return false
                }
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			
		},
		mounted() {
			this.getUsers();
			this.loadPolicy();
		}
	}

</script>

<style scoped>

</style>