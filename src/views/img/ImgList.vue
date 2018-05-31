<template>
    <div>
        <div class='top-banner'>
            <el-button @click='toAddImg' type='success' size='small'>添加资源</el-button>
        </div>
        <div class='img-content'>
            <div class='img' v-for='(i, index) in imgList' :key='index'>
                <i class='el-icon-close del-icon' @click='delItem(i.id)'></i>
                <img width='100%' height="100%" :src='i.imgurl'/>
            </div>
        </div>
        <div class='bottom-line' v-if='imgList.length > 0'>
            <el-button type='success' size="small" @click='handlePage(0)' :disabled="pageNumber == 1">上一页</el-button>
            <el-button type='success' size="small" @click='handlePage(1)'>下一页</el-button>
        </div>
        <el-dialog :visible.sync="showImg" width='600px' @close='showImg = false' title='添加图片'>
            <div class='line'>
                <div class='title'>
                    资源： 
                </div>
                <div class='img-item'>
                    <i class='el-icon-upload upload-btn' @click='openImg' v-if='!imgurl'></i>
                    <i class='el-icon-close del-btn' @click='clearItem' v-if='imgurl'></i>
                    <img :src='imgurl' width='100%' height="100%" v-if='imgurl'/>
                </div>
            </div>
            <div class='line'>
                <div class='title'>
                    url:
                </div>
                <el-input style='width: 300px;' v-model='imgurl' size='small'></el-input>
            </div>
            <el-button @click='addImg' type='success' size="small" class='btn'>确定添加</el-button>
            <input type='file' style="visibility: hidden" @change='uploadImg' id='upload' :value='imgurl0'/>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageNumber: 1,
            imgList: [],
            showImg: false,
            imgurl: '',
            imgurl0:''
        }
    },
    methods: {
        getList() {
            this.$api.Img.imgList(this.pageNumber, res => {
                if(res.imgs.length == 0 && this.pageNumber >=2) {
                    this.$message.warning('暂无更多数据~~~')
                    this.pageNumber--
                    this.getList()
                    return
                }
                this.imgList = res.imgs.sort((a, b) => {
                    return a.id - b.id
                })
            })
        },
        toAddImg() {
            this.showImg = true
            this.imgurl = ''
            this.imgurl0 = ''
        },
        delItem(id) {
            this.$api.Img.delImg(id, res => {
                if(res) {
                    this.$message.success('删除成功~~~')
                }
                    this.$message.error('删除失败~~~')
                    this.getList()
            })
        },
        handlePage(type) {
            if(type == 0) {
                this.pageNumber--
                this.getList()
            }
            else if(type == 1) {
                this.pageNumber++
                this.getList()
            }
        },
        openImg() {
            let imgBtn = document.getElementById('upload');
            imgBtn.click();
        },
        uploadImg() {
            let file = document.getElementById('upload').files;
            let formD = new FormData();
            formD.append('file', file[0]);
            console.log(file, formD)
            this.$api.Img.uploadImg(formD, res => {
                this.imgurl = res.url
            })
        },
        clearItem() {
            this.imgurl = ''
        },
        addImg() {
            if(this.imgurl == '') {
                this.$message.error('图片url不能为空~~~')
                return
            }
            this.$api.Img.addImg(this.imgurl, res => {
                if(res) {
                    this.$message.success('图片添加成功 ~~~')
                    this.showImg = false
                    this.getList()
                }
                else {
                    this.$message.error('图片添加失败，请重新添加 ~~~')
                }
            })
        }
    },
    created() {
        this.getList()
    }
}
</script>

<style  lang="scss" scoped>
.top-banner{
    padding: 10px 30px 0;
    display: flex;
    flex-direction: row;
}
.img-content{
    padding: 15px 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .img{
        margin: 17px;
        padding: 10px;
        width: 120px;
        height: 120px;
        border: 1.5px solid #747474;
        border-radius: 8px;
        position: relative;
        .del-icon{
            position: absolute;
            right: 2px;
            top: 1px;
            cursor: pointer;
        }
    }
}
.bottom-line{
    margin: 15px;
    text-align: center;
}
.img-item{
    width: 120px;
    height: 120px;
    padding: 10px;
    border: 1.5px solid #747474;
    border-radius: 8px;
    position: relative;
    .upload-btn{
        margin: 40px;
        cursor: pointer;
        font-size: 40px;
        color: #9e9d9d;
    }
    .del-btn{
        position: absolute;
        top: 2px;
        right: 2px;
        cursor: pointer;
    }
}
.btn{
    margin-left: 20px;
    margin-bottom: 20px;
}
.line{
    display: flex;
    flex-direction: row;
    margin: 20px;
    .title{
        width: 120px;
    }
}
</style>