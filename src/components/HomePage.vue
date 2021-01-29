<template>
<div>
  <navbar></navbar>
  <div class="hello">
    <div class="w3-content">
        <div class="w3-container w3-row w3-center w3-padding-32 w3-margin">
            <h1><strong>Select Your Available Time</strong></h1>
        </div>
        <div class="twt-week">
            <a href="#" class="w3-button w3-green w3-small">&#10094;</a>
            <span>Tuần 1 tháng 8: 03/08/2020 - 08/08/2020</span>
            <a href="#" class="w3-button w3-green w3-small">&#10095;</a>
        </div>
        <table class="w3-table-all twt-calendar">
            <thead>
                <tr class="w3-teal">
                    <th></th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="hour in hoursDay" :key="hour">
                    <td>{{hour}}</td>
                    <td v-for="day in daysInWeek" :key="day">
                      <div class="offline">
                        <input ref="timeref" class="w3-radio select-available-time" type="checkbox" :name="['0_'+hour+':00_'+day]" :id="['0_'+hour+':00_'+day]" @click="changeStateTime($event.target)">
                        <label :for="['0_'+hour+':00_'+day]">Offline</label>
                      </div>
                      <div class="online">
                        <input ref="timeref" class="w3-radio select-available-time" type="checkbox" :name="['1_'+hour+':00_'+day]" :id="['1_'+hour+':00_'+day]" @click="changeStateTime($event.target)">
                        <label :for="['1_'+hour+':00_'+day]">Online</label>
                      </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</div>
</template>

<script>
/* eslint-disable */
import {timeService} from './../services/time.service';
import {userService} from './../services';
import {router} from './../router/router';
import Navbar from './Navbar';

const hoursInDay = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];

function dates(current) {
    var week= new Array(); 
    // Starting Monday not Sunday
    current.setDate((current.getDate() - current.getDay() +1));

    for (var i = 0; i < 6; i++) {
      let diw = new Date(current);
      let month = '' + (current.getMonth() + 1),
          day = '' + current.getDate(),
          year = current.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
        week.push(
            [day, month, year].join('/')
        ); 
        current.setDate(current.getDate() +1);
    }
    return week; 
}
// console.logs(dates(new Date()));

export default {
  name: 'Calendar',
  data () {
    return {
        daysInWeek: dates(new Date()),
        hoursDay: hoursInDay,
        times: [],
        uid: localStorage.getItem('user'),
    }
  },  
  components: {
      'navbar' : Navbar
  },
  created() {
    timeService.getTimes(this.uid, this.daysInWeek[0], this.daysInWeek[this.daysInWeek.length-1]).then(data => {
        let arrData;
        arrData = JSON.parse(data)['data'];
        arrData.forEach(item => {
          let timeObj = {
            time: item.status+"_"+item.start_time.replace(" ","_"),
            id: item.id
          };
          this.times.push(timeObj);
        });
        this.$refs.timeref.forEach(x => {
          this.times.forEach(y => {
            if(x.id === y.time){
              x.checked = true;
              x.setAttribute('data-id', y.id);
            }
          });
        });
    });

  },
  // mounted(){
  //   console.log(this.$refs.myid);
  // },
  methods: {
    changeStateTime: function(e){
      let stt = e.name.split("_")[0],
      date = e.name.split("_")[2],
      time = e.name.split("_")[1],
      hour = time.split(":")[0],
      minute = time.split(":")[1],
      start_time = hour+":"+minute+":00 "+date,
      end_time = hour+":59:59 "+date,
      query_req = {
        uid: this.uid,
        start_time: start_time,
        end_time: end_time,
        status: stt,
      };
      if(e.checked){
        // e.parentElement.nextSibling.nextSibling.style.display = "none";
        // console.log();
        timeService.addTime(query_req).then(res => {
          e.setAttribute('data-id', JSON.parse(res)['id']);
        });
      }else{
        timeService.deleteTime(e.getAttribute('data-id')).then(res => {
          e.removeAttribute('data-id');
        });
      }
    }
  }
}
</script>

<style>
body{
  background-color: #f1f1f1;
}
</style>