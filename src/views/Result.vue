<template>
    <div class="result">
        <van-nav-bar
            title="模拟考试"
            left-text="返回"
            left-arrow
            @click-left="back"
        />

        <div class="img">
            <img src="//img.58cdn.com.cn/dist/jxedt/h5/m_new/img/mnks-result.png" alt="">
        </div>

        <div class="score">
            <span class="score-box">{{score}}</span>
            <span class="score-text">分</span>
        </div>

        <div class="time">
            <span class="time-text">用时</span>
            <span class="time-box">{{time}}</span>
        </div>
    </div>
</template>

<script>
    import '../assets/scss/result.scss'
    export default {
        data() {
            return {
                score: 0,
                time: 0,
            }
        },

        methods: {
            // 返回首页
            back() {
                this.$router.push({name: 'Home'})
            },

            // 初始化 获取分数 用时
            int() {
                this.score = this.$route.params.right

                let m = this.$route.params.time.m
                let s = this.$route.params.time.s
                if(m == 0) {
                    this.time = s + '秒'
                }else{
                    this.time = m + '分' + s + '秒'
                }
            }
        },

        created() {
            this.int()
        }
    }
</script>