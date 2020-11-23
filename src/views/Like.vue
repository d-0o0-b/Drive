<template>
    <div class="like">
        <van-nav-bar
            title="题目收藏"
            left-text="返回"
            left-arrow
            @click-left="back"
        />

        <div v-if="!emptyShow">
            <div class="test">
                <div class="question">
                    <span class="question-icon">{{type}}</span>
                    <div class="question-text">{{question}}</div>
                    <div class="question-img" v-if="!(imgurl == '')">
                        <img class="auto-img" :src=imgurl alt="">
                    </div>
                </div>
                <div class="item">
                    <div class="item-box clearfix" :class="[index == answertrue ? 'right' : '']" v-for="(item,index) in item" :key="index">
                        <div class="item-icon fl">{{item.id}}</div>
                        <div class="item-text fl">{{item.an}}</div>
                    </div>
                </div>
            </div>

            <div class="explain">
                <div class="explain-title">
                    <span class="explain-title-text">官方解释</span>
                </div>
                <div class="explain-text">{{explain}}</div>
            </div>

            <div class="bottom">
                <div class="like" @click="like">
                    <div class="like-icon">
                        <img :src="isLike ? require('../assets/img/like-active.svg') : require('../assets/img/like.svg')" alt="">
                    </div>
                    <div class="like-text">收藏</div>
                </div>

                <div class="statistics">
                    <div class="statistics-icon">
                        <img src="../assets/img/statistics.svg" alt="">
                    </div>
                    <div class="statistics-text">{{index+1}} / {{this.likeList.length}}</div>
                </div>

                <div class="next" @click="next">下一题</div>
                <div class="last" @click="last">上一题</div>
            </div>
        </div>

        <div v-if="emptyShow" class="empty">
            <van-empty description="收藏空空如也~">
                <van-button round type="danger" class="bottom-button" @click="goHome">
                    去练习题目
                </van-button>
            </van-empty>
        </div>
    </div>
</template>

<script>
    import "../assets/scss/like.scss"
    import {rexFilter} from "../assets/js/rexFilter"
    export default {
        data() {
            return {
                likeList: [],
                imgurl: '',
                isLike: false,
                id: 0,
                index: 0,
                question: '',
                answertrue: '',
                type: '',
                item: [],
                explain: '',
                emptyShow: false,
            }
        },
        
        methods: {
            // 返回
            back() {
                this.$router.go(-1)
            },

            // 跳转首页
            goHome() {
                this.$router.push({name: 'Home'})
            },

            // 获取收藏
            getLikeData() {
                this.likeList = []
                let data = JSON.parse(localStorage.getItem('orderTest'))
                if(!data) {
                    return
                }
                data.map(item => {
                    if(item.isLike) {
                        this.likeList.push(item.id)
                    }
                })
                if(!this.likeList.length) {
                    this.emptyShow = true
                }
            },

            // 获取题目
            getQuestion() {
                this.getLikeData()
                this.setId()
                this.init()
                this.$toast({
                    message: '加载中',
                    type: 'loading',
                    forbidClick: true,
                    duration: 0,
                    loadingType: 'spinner'
                })
                this.$axios.get('', {
                    params: {
                        id: this.id
                    }
                })
                .then((res) => {
                    this.$toast.clear()
                    this.question = res.data.question
                    this.imgurl = res.data.imageurl
                    this.answertrue = res.data.answertrue - 1
                    this.explain = rexFilter(res.data.explain)

                    if(res.data.type == 1) {
                        this.type = '判断'
                        this.item.push({
                            id: 'A',
                            an: "是"
                        })
                        this.item.push({
                            id: 'B',
                            an: "否"
                        })
                    }else if(res.data.type == 2) {
                        this.type = '单选'
                        this.item.push({
                            id: 'A',
                            an: res.data.an1
                        })
                        this.item.push({
                            id: 'B',
                            an: res.data.an2
                        })
                        this.item.push({
                            id: 'C',
                            an: res.data.an3
                        })
                        this.item.push({
                            id: 'D',
                            an: res.data.an4
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
            },

            // 更新当前id
            setId() {
                this.id = this.likeList[this.index]
            },

            // 收藏
            like() {
                let data = JSON.parse(localStorage.getItem('orderTest'))
                if(!data) {
                    return
                }
                data.map(item => {
                    if(item.id == this.id) {
                        item.isLike = !item.isLike
                    }
                })
                localStorage.setItem('orderTest',JSON.stringify(data))
                this.isLike = !this.isLike
            },

            // 初始化
            init() {
                // 清空选项
                this.item = []

                // 检测收藏 其实不必这样
                let data = JSON.parse(localStorage.getItem('orderTest'))
                if(!data) {
                    return
                }
                data.map(item => {
                    if(item.id == this.id) {
                        this.isLike = item.isLike
                    }
                })
            },

            // 下一题
            next() {
                if(this.index >= this.likeList.length-1) {
                    this.$toast('已经是最后一题了')
                    return
                }
                this.index++
                this.getQuestion()
            },

            // 上一题
            last() {
                if(this.index <= 0) {
                    this.$toast('已经是第一题了')
                    return
                }
                this.index-- 
                this.getQuestion()
            }
        },

        created(){
            this.getQuestion()
        }
    }
</script>