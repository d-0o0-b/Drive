<template>
    <div class="mockTest">
        <van-nav-bar
            title="模拟考试"
            left-text="返回"
            left-arrow
            @click-left="goHome"
        >
            <template #right>
                <span class="countDownTitle">倒计时</span>
                <van-count-down ref="countDown" :time="time" format="mm:ss" @finish="countDownFinish" />
            </template>
        </van-nav-bar>

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
            <div class="like fl" @click="handIn">
                <div class="like-icon">
                    <img src="../../assets/img/handIn.svg" alt="">
                </div>
                <div class="like-text">交卷</div>
            </div>
            <div class="like fl">
                <div class="like-icon">
                    <img src="../../assets/img/like.svg" alt="">
                </div>
                <div class="like-text">收藏</div>
            </div>
            <div class="statistics fr" @click="showPopup">
                <div class="statistics-icon">
                    <img src="../../assets/img/statistics.svg" alt="">
                </div>
                <div class="statistics-text">{{id}} / {{this.maxId}}</div>
            </div>
            <div class="wrong fr">
                <div class="wrong-icon">
                    <img src="../../assets/img/wrong.svg" alt="">
                </div>
                <div class="wrong-text">{{wrong}}</div>
            </div>
            <div class="right fr">
                <div class="right-icon">
                    <img src="../../assets/img/right.svg" alt="">
                </div>
                <div class="right-text">{{right}}</div>
            </div>
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
    import '../../assets/scss/mockTest.scss'
    export default {
        data() {
            return {
                time: 45 * 60 * 1000,
                id: 1,
                maxId: 100,
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
                isPopup: false,
                list: [],
                showTip: true
            }
        },

        methods: {
            // 返回
            goHome() {
                this.$router.push({name: 'Home'})
            },

            //跳转结果页面
            goResult(m,s) {
                this.$router.push({name: 'Result',params:{
                    right: this.right, 
                    wrong: this.wrong,
                    time: {
                        m: m,
                        s: s
                    }
                }})
            },

            // 交卷
            handIn(fail) {
                // 计算未做题数
                let undone = this.maxId - this.right - this.wrong

                // 计算用时
                let timeData = this.$refs.countDown
                let minutes = timeData.timeData.minutes
                let seconds = timeData.timeData.seconds
                let time = 45 * 60 - minutes * 60 - seconds
                let m = parseInt(time/60)
                let s = time%60

                // 答题不及格 就不提示未做题目了
                if(fail == 'fail') {
                    this.goResult(m,s)
                    return
                }

                if(undone > 0) {
                    this.$dialog.confirm({
                        message: `你还有${undone}道题未做，确定要交卷吗`,
                    })
                    .then(() => {
                        this.goResult(m,s)
                    })
                    .catch(() => {
                        // on cancel
                    });
                }else{
                    this.$dialog.confirm({
                        message: `你已经做完所有题目，但还有时间所剩，确定要交卷吗`,
                    })
                    .then(() => {
                        this.goResult(m,s)
                    })
                    .catch(() => {
                        // on cancel
                    });
                }
            },

            //倒计时结束
            countDownFinish() {
                this.$dialog.alert({
                    title: '考试时间已结束',
                    message: '考试时间已结束，请点击确定按钮交卷',
                }).then(() => {
                    this.goResult(45,0)
                });
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
                    // this.setProgress()
                    this.question = res.data.question
                    this.imgurl = res.data.imageurl
                    this.answertrue = res.data.answertrue - 1
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
                    this.right++
                    this.list[this.id-1].isRight = true
                    this.flag = false
                    // 记录答案 正确
                    this.recordAnswer({    
                        id: this.id,
                        isRight: true,
                        index: index,
                        an: this.answertrue
                    },true)
                    this.isRight = true
                    //自动下一题
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
                        an: this.answertrue
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

                    if(this.showTip) {
                        // 错题大于10不及格 交卷
                        if(this.wrong > 10) {
                            this.$dialog.confirm({
                                title: '不及格',
                                message: '当前分数已低于90分不及格，是否现在交卷',
                                confirmButtonText: '现在交卷',
                                cancelButtonText: '继续答题'
                            })
                            .then(() => {
                                // on confirm
                                this.handIn('fail')
                            })
                            .catch(() => {
                                this.showTip = false
                            });
                        }
                    }

                    //自动下一题
                    setTimeout(()=>{
                        this.next()
                    },500)
                }
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

            // 更新flag状态 是否可以点击题目
            setFlag() {
                let data = JSON.parse(localStorage.getItem('mockTest'))
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
                let data = JSON.parse(localStorage.getItem('mockTest'))
                if(!data) {
                    data = []
                }
                if(data) {
                    let f = data.every(item => {
                       return item.id != this.id
                    })
                    if(f) {
                        data.push(o)
                        localStorage.setItem('mockTest',JSON.stringify(data))
                    }
                }else{
                    data.push(o)
                    localStorage.setItem('mockTest',JSON.stringify(data))
                }
            },

            // 初始化
            intData() {
                this.item = []
                this.isRight = null
                this.choseIndex = null
                this.answerIndex = null
                let data = JSON.parse(localStorage.getItem('mockTest'))
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

            // 初始/更新list
            setList() {
                for(let i = 0; i < this.maxId; i++) {
                    this.list.push({
                        id:i+1,
                        isRight: null
                    })
                }
            }
        },

        created() {
            this.setList()
            let data = JSON.parse(localStorage.getItem("mockTest"))
            data = []
            localStorage.setItem("mockTest",JSON.stringify(data))
            this.getQuestion()
        },
    }
</script>