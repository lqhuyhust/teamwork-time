<template>
    <div class="w3-bar w3-green twt-header">
        <a class="w3-bar-item w3-padding-16 brand">
            <h3><router-link to="/home">Teamwork Time</router-link></h3>
        </a>
        <div class="w3-right w3-padding-16">
            <a href="#" class="w3-bar-item w3-button w3-padding-16 w3-hide-small w3-hide-medium"><router-link to="/home">Calendar</router-link></a>
            <a class="w3-bar-item w3-button w3-padding-16 w3-hide-small w3-hide-medium"><router-link :to="{name: 'reports', query: {page: 1}}">Reports</router-link></a>
            <a href="#" class="w3-bar-item w3-button w3-padding-16 w3-hide-small w3-hide-medium"><router-link to="/available-time">Available time</router-link></a>
            <a class="w3-bar-item w3-button w3-padding-16 w3-hide-small w3-hide-medium"><router-link to="/login">Logout</router-link></a>
        </div>
    </div>
</template>

<script>

export default {
    name: 'nav-bar',
    data () {
        return {} 
    },
    mothods: {
         
    } 
}
</script>