<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<!--
    checkStrictly  //父阶是否选中
    disabled: //是否可选，true=不可选  false=可选  none=按数据控制
-->
<template>
    <el-tree
        ref="tree"
        :data="menuList"
        :node-key="nodeKey"
        :props="defaultProps"
        :check-strictly="checkStrictly"
        @check="selectMenuItem"
        :show-checkbox="showCheckbox"
        :default-checked-keys="defaultCheckedKeys">
    </el-tree>
</template>
<script>

export default {
    name:'checkedTree',
    props:{
        menuList:[],
        showCheckbox:{
            type:Boolean,
            default:true
        },
        defaultCheckedKeys:[],
        nodeKey:{
            type:String,
            default:"oid"
        },
        disabled:{
            type:String,
            default:"false"
        },
        checkStrictly:{
            type:Boolean,
            default:true
        },
    },
    data(){
        return {
            defaultProps: {
                children: 'children',
                label: 'name',
                disabled:this.dealDisabled
            }
        }
    },
    created:function(){

    },
    watch:{

    },
    mounted:function(){

    },
    updated:function(){

    },
    methods:{
        selectMenuItem(data){
            if(this.checkStrictly){
                this.dealTreeParent(data.oid);
                this.dealTreeChild(data.oid);
            }
        },
        dealTreeParent(v){
            let node = this.$refs.tree.getNode(v);
            if(!this.$kgUtil.isEmpty(node.parent.key)){
                node.checked && this.$refs.tree.setChecked(node.parent.key,true,false)
                if(!node.checked && node.level != 4){
                    var parentNode = this.$refs.tree.getNode(node.parent.key);
                    var parentChildNode = parentNode.childNodes;
                    var parentChildNodeChecked = false;
                    parentChildNodeChecked = parentChildNode.some((item)=>{
                        if(item.checked){return true};
                    });
                    !parentChildNodeChecked && this.$refs.tree.setChecked(node.parent.key,false,false);
                }
                this.dealTreeParent(node.parent.key);
            };
        },
        dealTreeChild(v){
            let node = this.$refs.tree.getNode(v);
            var childNode = node.childNodes;
            if(!this.$kgUtil.isEmpty(childNode)){
                node.checked && childNode.map((item)=>{
                    this.$refs.tree.setChecked(item.key,true,false);
                    this.dealTreeChild(item.key);
                });
                !node.checked && childNode.map((item)=>{
                    this.$refs.tree.setChecked(item.key,false,false);
                    this.dealTreeChild(item.key);
                });
            }
        },
        getCheckedNodeByType(type){
            var allCheckedNodes = this.$refs.tree.getCheckedNodes(false,false);
            var arr = new Array();
            for(var i = 0; i < allCheckedNodes.length; i++){
                if(allCheckedNodes[i].type == type){
                    arr.push(allCheckedNodes[i]);
                }
            }
            return arr;
        },
        getCheckedKeyByType(type){
            var allCheckedNodes = this.$refs.tree.getCheckedNodes(false,false);
            var arr = new Array();
            for(var i = 0; i < allCheckedNodes.length; i++){
                if(allCheckedNodes[i].type == type){
                    arr.push(allCheckedNodes[i][this.nodeKey]);
                }
            }
            return arr;
        },
        dealDisabled(v){
            var r = false;
            if(this.disabled == "true") r = true;
            if(this.disabled == "none") r = v.disabled;
            return r;
        }
    }
}
</script>
<style>
</style>
