import axios from 'axios'
export default {

    data:function(){
        return {
            download:false
        }
    },
    methods:{
        getdownload(params){
            var _this = this;
            return axios.get('http://localhost:3000/interesting',{
                params :params
            }).then((res)=>{
                setTimeout(function(){
                    
                        _this.download = res.data.state.download;
                        console.log(_this.download);
                    
                },2500)
            })
            

        }
    }
}