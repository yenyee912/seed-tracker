<template>
  <div class="calender">
    <!-- <h3 class="text-center">Harvest in Langkawi</h3> -->
    <FullCalendar class="app-calendar" ref="fullCalendar"
    defaultView="dayGridMonth" eventLimit: true :header="{ left: 'prev,next ',
    center: 'title', right: 'today' }" eventColor= '#dcdcdc'
    :views="contentLimit" :plugins="calendarPlugins"
    :weekends="calendarWeekends" :events="calendarEvents"
    @dateClick="handleDateClick" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// must manually include stylesheets for each plugin
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'

import axios from 'axios'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data(){
    return {
      calendarPlugins: [
        // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      calendarWeekends: true,
      calendarEvents: [],
      contentLimit: {
        dayGridMonth: {
          eventLimit: 4 // adjust to 4 only for dayGridMonth
        }
      }
    }
  },
  methods: {
    async handleDateClick(arg) {

      // data duplication prevention
      for (var item in this.calendarEvents) {
        if (this.calendarEvents[item].start == arg.dateStr) {
          // console.log(this.calendarEvents[item].start)
          return false
        }
      }

      const x= await axios.get(`${process.env.VUE_APP_ROOT_API}/harvest/calendar?date=${arg.dateStr}&location=2`)
      try{
        if (x.data.msg){
          this.calendarEvents.push({
              title: x.data.msg,
              start: arg.dateStr
            })        
            // console.log("no harvest")

        }

        else if(x.data){
          // console.log(x.data)
          for (var i in x.data) {
            if (Array.isArray(x.data) && x.data.length > 0) {
              this.calendarEvents.push(x.data[i])
            }
          }
        }
      }

      catch(err){
          console.log(err)

      }
    }
  }
}
</script>

<style>
.calender {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  margin-top: 20px;
}

.calender-top {
  margin: 0 0 10em;
}

.app-calendar {
  margin: 0 auto;
  max-width: 900px;
}
</style>
