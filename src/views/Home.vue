<template>
    <div class="home">
        <van-nav-bar
            title="驾考"
        />

        <div class="banner-box">
            <van-swipe class="swipe" :autoplay="3000" indicator-color="white"> 
                <van-swipe-item class="swipe-box">
                    <img src="http://j2.58cdn.com.cn/dist/jxedt/h5/products/m/images/jx_bg.png" alt="">
                </van-swipe-item>
                <van-swipe-item class="swipe-box">
                    <img src="//j2.58cdn.com.cn/dist/jxedt/h5/products/m/images/58esc.jpg" alt="">
                </van-swipe-item>
                <van-swipe-item class="swipe-box">
                    <img src="//img.58cdn.com.cn/dist/jxedt/h5/m_new/img/kqmj_til_home.png" alt="">
                </van-swipe-item>
            </van-swipe>
        </div>

        <div class="sort clearfix">
            <div class="sort-box" @click="changeStatus(index)" :class="[index % 2 == 0 ? 'fl' : 'fr']" v-for="(item,index) in sort" :key="index">
                <div class="sort-circle">
                   <div class="sort-circle-box">
                        <div class="sort-icon">
                            <img :src=item.img alt="">
                        </div>
                        <div class="sort-text">{{item.title}}</div>
                   </div>
                </div>
            </div>
        </div>

        <div class="subject" v-show="status == 0">
            <div class="subject-box">
                <div class="subject-boxing">
                    <div class="subject-content" @click="goRoute(item)"  v-for="(item,index) in subject" :key="index">
                        <div class="subject-content-boxing">
                            <div class="subject-icon">
                                <img class="auto-img" :src=item.img alt="">
                            </div>
                            <div class="subject-title">{{item.title}}</div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>

        <div class="subject" v-show="status == 1">
            <div class="subject-box">
                <div class="subject-boxing">
                    <div class="subject-content" @click="goRoute(item)" v-for="(item,index) in personal" :key="index">
                        <div class="subject-content-boxing">
                            <div class="subject-icon">
                                <img class="auto-img" :src=item.img alt="">
                            </div>
                            <div class="subject-title">{{item.title}}</div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/scss/home.scss'
    export default {
        data() {
            return {
                status: 0,
                sort: [
                    {
                        title: '驾考题目',
                        img: require('../assets/img/home-sort01.svg')
                    },
                    {
                        title: '个人收藏',
                        img: require('../assets/img/home-sort02.svg')

                    }
                ],
                subject: [
                    {
                        title: '顺序练习',
                        img: require('../assets/img/home-subject01.svg'),
                    },
                    {
                        title: '模拟考试',
                        img: require('../assets/img/home-subject02.svg'),
                    },
                    {
                        title: '章节练习',
                        img: require('../assets/img/home-subject03.svg'),
                    },
                ],
                personal: [
                    {
                        title: "题目收藏",
                        img: require('../assets/img/home-subject04.svg'),
                    },
                    {
                        title: "错题集本",
                        img: require('../assets/img/home-subject05.svg'),
                    },
                    {
                        title: "答题记录",
                        img: require('../assets/img/home-subject06.svg'),
                    },
                ]
            }
        },

        methods: {
            // 跳转顺序练习
            goRoute(item) {
                if(item.title == '顺序练习') {
                    this.$router.push('/orderTest')
                }
                if(item.title == '模拟考试') {
                    this.$router.push({name: 'MockTestBefore'})
                }
                if(item.title == '章节练习') {
                    this.$router.push('/chapterTest')
                }
                if(item.title == '题目收藏') {
                    this.$router.push('/like')
                }
                if(item.title == '错题集本') {
                    this.$router.push('/mistake')
                }
                if(item.title == '答题记录') {
                    this.$router.push('/record')
                }
            },

            // 改变模式
            changeStatus(index) {
                if(index == 0) {
                    this.status = 0
                }else if(index == 1) {
                    this.status = 1
                }
            },
        }
    }
</script>