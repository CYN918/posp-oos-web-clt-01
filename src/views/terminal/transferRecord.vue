<template>
	<section>
	    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="mobile" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="toMobile" placeholder="名称"></el-input>
				</el-form-item>	
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="startSn" label="终端号始" width="160" sortable>
			</el-table-column>
			<el-table-column prop="endSn" label="终端号末" width="160" sortable>
			</el-table-column>
			<el-table-column prop="total" label="机具数量" width="150" sortable>
			</el-table-column>
			<el-table-column prop="state" label="终端状态" width="120" :formatter="formatState" sortable>
			</el-table-column>
			<el-table-column prop="anentName" label="划拨人" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="toAgentName" label="接收人" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="划拨人手机号" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="toMobile" label="接收人手机号" min-width="180" sortable>
			</el-table-column>
			<el-table-column
		      fixed="right"
		      label="操作"
		      width="120">
		      <template slot-scope="scope">
		        <el-button @click="handleClick(scope.row)" type="text" size="small">查看保理</el-button>
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

		<!--查看保理界面-->
		<el-dialog title="查看保理" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :data="addForm" label-width="120px" ref="addForm" v-loading="loading">
				<el-form-item label="订单号" prop="orderNo">
					<el-input v-model="addForm.orderNo" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="单价" prop="price">
					<el-input v-model="addForm.price" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="总数量" prop="num">
					<el-input v-model="addForm.num" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="总期数" prop="term">
					<el-input v-model="addForm.term" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="保理总额" prop="amount">
					<el-input v-model="addForm.amount" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="每期金额" prop="termAmount">
					<el-input v-model="addForm.termAmount" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="发送人" prop="agentName">
					<el-input v-model="addForm.agentName" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="接收人" prop="toAgentName">
					<el-input v-model="addForm.toAgentName" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="政策名称" prop="policyName">
					<el-input v-model="addForm.policyName" readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
		
	</section>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
				toMobile: '',
				users: [],
				addForm: [],
				total: '',
				listLoading: false,
				pageSize: 10,
				currentPage: 1,
				token: localStorage.getItem('token'),
				addFormVisible: false,//新增界面是否显示
				loading: false,
			}
		},
		methods: {
		    formatState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '下拨中';
	            }else if (cellValue == "2"){
	                return '已下拨';
	            }else if (cellValue == "10"){
	                return '已失效'
	            }
		    },
		    handleCurrentChange(val) {
		        console.log(val);
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
                        toMobile: this.toMobile,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'POS_013',params).then(function(response) {
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
			handleClick(row) {
			    this.addFormVisible = true;
		        var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
                        loanId: row.loanId,
			        }
			    }
			    this.loading = true;
                this.$http.post(this.baseCont.JAVA_API + 'POS_014',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.addForm = response.body.BODY.res;
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