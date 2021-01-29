<template>
    <div class="jumbotron">
        <div id="aaa" class="container">

            <div class="row">
                <div class="col-sm-6 offset-sm-3">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from './components/Navbar';

export default {
    name: 'app',
    data() { 
        return {
            
        }
    }
};
</script>

<style scoped>
    @import url('./assets/css/style.css');
    @import url('./assets/css/w3.css');
    #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    }
</style>