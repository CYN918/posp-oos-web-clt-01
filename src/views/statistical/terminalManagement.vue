<template>
	<section>
		
	</section>
</template>

<script>
	export default {
		data() {
			return {
				pageSize: 10,
				currentPage: 1,
				listLoading: false,
				sels: [],//列表选中列				
				editLoading: false,
				token: localStorage.getItem("token"),
			}
		},
		methods: {
		    
		},
		mounted() {
			
		}
	}

</script>

<style scoped>

</style>