<template>
    <div class="mockTestBefore">
        <van-nav-bar
            title="模拟考试"
            left-text="返回"
            left-arrow
            @click-left="back"
        />

        <div class="object">
            <div class="object-item clearfix" v-for="(item,index) in object" :key="index">
                <div class="object-item-title fl">{{item.title}}：</div>
                <div class="object-item-text fl">{{item.content}}</div>
            </div>
        </div>

        <div class="tip">{{tip}}</div>

        <div class="mockBtn-box">
            <van-button block round @click="goMockTest">全真模拟考试</van-button>
        </div>
    </div>
</template>

<script>
    import '../../assets/scss/mockTestBefore.scss'
    export default {
        data() {
            return {
                object: [
                    {
                        title: '考试科目',
                        content: '科目一理论考试'
                    },
                    {
                        title: '考试题库',
                        content: '小车（C1，C2，C3）'
                    },
                    {
                        title: '考试标准',
                        content: '100题，45分钟'
                    },
                    {
                        title: '合格标准',
                        content: '90分及格'
                    },
                    {
                        title: '出题规则',
                        content: '交通局出题规则'
                    },
                ],
                tip: '答题不可修改，累计错题分数达到不及格标准时，系统自动提醒交卷，考试不通过'
            }
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1)
            },

            // 跳转模拟考试
            goMockTest() {
                this.$router.push({name: 'MockTest'})
            }
        }
    }
</script>