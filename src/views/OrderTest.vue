<template>
    <div class="orderTest">
        <van-nav-bar
            title="顺序练习"
            left-text="返回"
            left-arrow
            @click-left="back"
        />

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
            <div class="like fl" @click="like">
                <div class="like-icon">
                    <img :src="isLike ? require('../assets/img/like-active.svg') : require('../assets/img/like.svg')" alt="">
                </div>
                <div class="like-text">收藏</div>
            </div>
            <div class="statistics fr" @click="showPopup">
                <div class="statistics-icon">
                    <img src="../assets/img/statistics.svg" alt="">
                </div>
                <div class="statistics-text">{{id}} / {{this.maxId}}</div>
            </div>
            <div class="wrong fr">
                <div class="wrong-icon">
                    <img src="../assets/img/wrong.svg" alt="">
                </div>
                <div class="wrong-text">{{wrong}}</div>
            </div>
            <div class="right fr">
                <div class="right-icon">
                    <img src="../assets/img/right.svg" alt="">
                </div>
                <div class="right-text">{{right}}</div>
            </div>
        </div>

        <div class="explain" v-show="!flag">
            <div class="explain-title">
                <span class="explain-title-text">官方解释</span>
            </div>
            <div class="explain-text">{{explain}}</div>
        </div>

        <div class="next" @click="next">下一题</div>
        <div class="last" @click="last">上一题</div>

        <van-popup v-model="isPopup" position="bottom" class="popup clearfix">
            <div class="popup-box fl" :class="{active: index == id-1, right: item.isRight, wrong: item.isRight==false}" @click="changeId(index)" v-for="(item,index) in list" :key="index">
                {{item.id}}
            </div>
        </van-popup>
    </div>
</template>

<script>
    import "../assets/scss/orderTest.scss"
    import {rexFilter} from "../assets/js/rexFilter"
    export default {
        data() {
            return {
                id: 1,
                maxId: 1600,
                question: '',
                item: [],
                type: '',
                imgurl: '',
                answertrue: null,
                answerIndex: null,
                right: 0,
                wrong: 0,
                flag: true,
                progress: 1,
                isRight: null,
                choseIndex: null,
                explain: "",
                isPopup: false,
                list: [],
                isLike: false,
            }
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1)
            },

            // 弹出底层
            showPopup() {
                this.isPopup = true
            },

            // 跳转题目
            changeId(index) {
                this.id = index+1
                this.getQuestion()
                this.isPopup = false
            },

            // 获取题目
            getQuestion() {
                this.$toast({
                    message: '加载中',
                    type: 'loading',
                    forbidClick: true,
                    duration: 0,
                    loadingType: 'spinner'
                })
                this.intData()
                this.$axios.get('', {
                    params: {
                        id: this.id
                    }
                })
                .then((res) => {
                    this.$toast.clear()
                    this.serProgress()
                    this.question = res.data.question
                    this.imgurl = res.data.imageurl
                    this.answertrue = res.data.answertrue - 1
                    this.explain = rexFilter(res.data.explain)
                    this.setFlag()
                    this.checkLike()
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
                    this.right++
                    this.list[this.id-1].isRight = true
                    this.flag = false
                    // 记录答案 正确
                    this.recordAnswer({    
                        id: this.id,
                        isRight: true,
                        index: index,
                        an: this.answertrue,
                        isLike: false
                    },true)
                    this.isRight = true
                    // 答对自动下一题
                    setTimeout(()=>{
                        this.next()
                    },500)
                }else{
                    this.wrong++
                    this.list[this.id-1].isRight = false
                    this.flag = false
                    // 记录答案 错误
                    this.recordAnswer({    
                        id: this.id,
                        isRight: false,
                        index: index,
                        an: this.answertrue,
                        isLike: false
                    },true)
                    this.isRight = false

                    // 存储错题
                    let wrongData = JSON.parse(localStorage.getItem('wrongData'))
                    if(!wrongData) {
                        wrongData = []
                    }
                    let f = wrongData.every(item => {
                        return item.id != this.id
                    })
                    if(f) {
                        wrongData.push({
                            id: this.id,
                            an: this.answertrue,
                        })
                    }
                    localStorage.setItem('wrongData',JSON.stringify(wrongData))
                }
                this.recordRWCount()
            },

            // 下一题
            next() {
                if(this.id >= this.maxId) {
                    this.$toast('已经是最后一题啦')
                    return
                }
                this.id++
                this.getQuestion()
            },

            // 上一题
            last() {
                if(this.id <= 1) {
                    this.$toast('已经是第一题啦')
                    return
                }
                this.id--
                this.getQuestion()
            },

            // 记录答题进度
            serProgress() {
                if(this.id > this.progress) {
                    this.progress = this.id
                    this.flag = true
                    let data = JSON.parse(localStorage.getItem('progress'))
                    data = this.progress
                    localStorage.setItem('progress',JSON.stringify(data))
                }
            },

            // 记录对错题数
            recordRWCount() {
                let data = JSON.parse(localStorage.getItem('RWCount'))
                if(!data) {
                    data = {
                        right: 0,
                        wrong: 0
                    }
                }
                data.right = this.right
                data.wrong = this.wrong
                localStorage.setItem('RWCount',JSON.stringify(data))
            },

            // 更新flag状态 是否可以点击题目
            setFlag() {
                let data = JSON.parse(localStorage.getItem('orderTest'))
                if(!data) {
                    data = []
                }
                if(data) {
                    let f = data.every(item => {
                       return item.id != this.id
                    })
                    if(f) {
                        this.flag = true
                    }
                }
            },

            // 记录答题情况
            recordAnswer(o) {
                let data = JSON.parse(localStorage.getItem('orderTest'))
                if(!data) {
                    data = []
                }
                if(data) {
                    // 确认之前的题目有无已经做过的
                    let f = data.every(item => {
                       return item.id != this.id
                    })
                    if(f) {
                        data.push(o)
                        localStorage.setItem('orderTest',JSON.stringify(data))
                    }else{
                        // 没有做过，但有收藏的题目
                        data.map(v => {
                            if(v.id == o.id && v.index == null) {
                                v.isRight = o.isRight
                                v.index = o.index
                            }
                        })
                        localStorage.setItem('orderTest',JSON.stringify(data))
                    }  
                }else{
                    data.push(o)
                    localStorage.setItem('orderTest',JSON.stringify(data))
                }
            },

            // 初始化
            intData() {
                this.item = []
                this.isRight = null

                if(JSON.parse(localStorage.getItem('progress'))) {
                    this.progress = JSON.parse(localStorage.getItem('progress'))
                }
                this.choseIndex = null
                this.answerIndex = null
                this.isLike = false

                let data = JSON.parse(localStorage.getItem('orderTest'))
                if(data) {
                    data.map(item => {
                        if(item.id == this.id) {
                            if(item.index != undefined) {
                                this.choseIndex = item.index
                                this.answertrue = item.an
                                this.answerIndex = this.answertrue
                                this.flag = false
                            }
                        }
                    })
                }
            },

            // 初始 题状态list
            setList() {
                for(let i = 0; i < this.maxId; i++) {
                    this.list.push({
                        id:i+1,
                        isRight: null,
                        isLike: false
                    })
                }
                let data = JSON.parse(localStorage.getItem("orderTest"))
                if(data) {
                    data.map(item => {
                        this.list.map(v => {
                            if(v.id == item.id) {
                                v.isRight = item.isRight
                                v.isLike = item.isLike
                            }
                        })
                    })
                }
            },

            // 更新list题状态
            updateList() {

            },

            // 检测收藏
            checkLike() {
                this.isLike = this.list[this.id-1].isLike
            },

            // 收藏
            like() {
                this.list[this.id - 1].isLike = !this.list[this.id - 1].isLike

                let data = JSON.parse(localStorage.getItem('orderTest'))
                // f 本地有无该题信息 
                let f = false
                if(data) {
                    data.map(item => {
                        if(item.id == this.id) {
                            item.isLike = !item.isLike
                            f = true
                            return
                        }
                    })
                }
                if(!f) {
                    if(!data) {
                        data = []
                    }
                    data.push({
                        id: this.id,
                        isRight: null,
                        index: null,
                        an: this.answertrue,
                        isLike: true
                    })
                }
                localStorage.setItem('orderTest',JSON.stringify(data))
                this.checkLike()
            }
        },

        created() {
            this.setList()

            let RWCount = JSON.parse(localStorage.getItem("RWCount"))
            if(RWCount) {
                this.right = RWCount.right
                this.wrong = RWCount.wrong 
            }

            let progress = JSON.parse(localStorage.getItem("progress"))
            if(progress > 1) {
                this.$dialog.confirm({
                    title: '开始练习',
                    message: `上次练习到${progress}题,是否继续`,
                }).then(() => {
                    this.id = progress
                    this.getQuestion()
                })
                .catch(() => {
                    let data = JSON.parse(localStorage.getItem("orderTest"))
                    data = []
                    localStorage.setItem("orderTest",JSON.stringify(data))

                    let progress = JSON.parse(localStorage.getItem("progress"))
                    progress = 1
                    localStorage.setItem("progress",JSON.stringify(progress))

                    let RWCount = JSON.parse(localStorage.getItem("RWCount"))
                    RWCount = {}
                    localStorage.setItem("RWCount",JSON.stringify(RWCount))
                    this.right = 0
                    this.wrong = 0

                    for(let i = 0; i < this.maxId; i++) {
                        this.list[i].isRight = null
                        this.list[i].isLike = false
                    }

                    this.getQuestion()
                });
            }else{
                this.getQuestion()
            }
        },
    }
</script>