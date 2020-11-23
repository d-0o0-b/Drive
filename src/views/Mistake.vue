<template>
    <div class="mistake">
        <van-nav-bar
            title="错题收集"
            left-text="返回"
            left-arrow
            @click-left="goHome"
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
                    <div class="item-box clearfix" :class="{active: index == choseIndex,right: index == answerIndex,wrong: index != answerIndex && index == choseIndex}" ref="item" @click="choseAnswer(index)" v-for="(item,index) in item" :key="index">
                        <div class="item-icon fl">{{item.id}}</div>
                        <div class="item-text fl">{{item.an}}</div>
                    </div>
                </div>
            </div>

            <div class="bottom clearfix">
                <div class="like fl" @click="deleteItem">
                    <div class="like-icon">
                        <img src="../assets/img/delete.svg" alt="">
                    </div>
                    <div class="like-text">删除</div>
                </div>
                <div class="statistics fl">
                    <div class="statistics-icon">
                        <img src="../assets/img/statistics.svg" alt="">
                    </div>
                    <div class="statistics-text">{{index+1}} / {{this.wrongData.length}}</div>
                </div>
                <div class="next" @click="next">下一题</div>
                <div class="last" @click="last">上一题</div>
            </div>

            <div class="explain" v-show="!flag">
                <div class="explain-title">
                    <span class="explain-title-text">官方解释</span>
                </div>
                <div class="explain-text">{{explain}}</div>
            </div>
        </div>

        <div v-if="emptyShow" class="empty">
            <van-empty description="目前还没有错题哦~">
                <van-button round type="danger" class="bottom-button" @click="goHome">
                    去练习题目
                </van-button>
            </van-empty>
        </div>
    </div>
</template>

<script>
    import "../assets/scss/mistake.scss"
    import {rexFilter} from "../assets/js/rexFilter"
    export default {
        data() {
            return {
                emptyShow: false,
                wrongData: [],
                index: 0,
                maxIndex: 0,
                id: 0,
                question: '',
                item: [],
                type: '',
                imgurl: '',
                answertrue: null,
                answerIndex: null,
                flag: true,
                isRight: null,
                choseIndex: null,
                explain: "",
                list: [],
            }
        },

        methods: {
            // 返回首页
            goHome() {
                this.$router.push({name: 'Home'})
            },

            // 获取错题
            getWrongData() {
                let wrongData = JSON.parse(localStorage.getItem('wrongData'))
                if(!wrongData) {
                    this.emptyShow = true
                    return
                }
                this.wrongData = wrongData
            },

            // 初始化id
            setId() {
                this.id = this.wrongData[this.index].id
            },

            // 初始化
            init() {
                // 清空选项
                this.item = []

                // 初始对错状态
                this.isRight =  null

                // 初始选择状态
                this.choseIndex = null

                // 初始答案状态
                this.answerIndex = null
            },

            // 更新flag状态 是否可以点击题目
            setFlag() {
                // this.maxIndex = this.index > this.maxIndex ? this.index : this.maxIndex
                // if(this.index < this.maxIndex) {
                //     this.flag = false
                // }

                this.wrongData.map(item => {
                    if(item.id == this.id) {
                        // 该题未做 可点击
                        if(item.index == null) {
                            this.flag = true
                        }else{
                            // 该题已做 不能点击 渲染对错状态
                            this.flag = false
                            this.isRight = item.isRight
                            this.choseIndex = item.index
                            this.answerIndex = item.an
                        }
                    }
                })
            },

            // 获取题目
            getQuestion() {
                // this.getWrongData()
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
                    this.setFlag()
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

            // 选择答案
            choseAnswer(index) {
                if(!this.flag) {
                    return
                }
                // 选中答案背景变灰
                this.$refs.item[index].classList.add('active')
                if(this.flag) {
                    this.choseIndex = index
                    this.answerIndex = this.answertrue
                }

                if(index == this.answertrue) {
                    // 答对 
                    this.wrongData.map(v => {
                        if(v.id == this.id) {
                            v.isRight = true
                            v.index = index
                        }
                    })
                    this.flag = false
                    this.isRight = true
                    
                    // 答对自动下一题
                    setTimeout(()=>{
                        this.next()
                    },500)
                }else{
                    // 答错
                    this.wrongData.map(item => {
                        if(item.id == this.id) {
                            item.isRight = false
                            item.index = index
                        }
                    })
                    this.flag = false
                    this.isRight = false
                }
            },

            // 下一题
            next() {
                if(this.index >= this.wrongData.length-1) {
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
            },

            // 删除题目
            deleteItem() {
                this.wrongData.map((v,i) => {
                    if(v.id == this.id) {
                        this.wrongData.splice(i,1)
                    }
                })
                this.$toast('删除成功')
                localStorage.setItem('wrongData',JSON.stringify(this.wrongData))
            }
        },

        created() {
            let wrongData = JSON.parse(localStorage.getItem('wrongData'))
            if(!wrongData || wrongData.length == 0) {
                this.emptyShow = true
                return
            }else{
                this.getWrongData()
                this.getQuestion()
            }
        }
    }
</script>