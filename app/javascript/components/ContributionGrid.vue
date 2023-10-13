<!-- app/javascript/components/ContributionGrid.vue -->

<template>
  <div>
    <div id="weekday-headers">
      <div>月</div>
      <div>火</div>
      <div>水</div>
      <div>木</div>
      <div>金</div>
      <div>土</div>
      <div>日</div>
    </div>
    <div v-for="(day, index) in days"
         :key="index"
         :class="['day-cell', day.monthClass]"
         :data-day="day.number"
         :title="day.title"
         @mouseenter="showTooltip($event, day)"
         @mouseleave="hideTooltip">
    </div>
    <div v-if="tooltip.visible"
         :style="{top: tooltip.top + 'px', left: tooltip.left + 'px'}"
         class="tooltip">
      {{ tooltip.title }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      days: [],
      tooltip: { visible: false, title: '', top: 0, left: 0 }
    };
  },
  mounted() {
    this.initializeContributionGrid();
  },
  methods: {
    initializeContributionGrid() {
      this.renderDaysOfMonth();
      if (this.$el.classList.contains('mypage')) {
        this.fetchAndRenderContributions();
      }
    },
    renderDaysOfMonth() {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const dayOfWeek = firstDayOfMonth.getDay();

      const daysInPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      const daysToShowFromPreviousMonth = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      for (let day = daysInPreviousMonth - daysToShowFromPreviousMonth + 1; day <= daysInPreviousMonth; day++) {
        this.days.push(this.createDayCell(day, 'previous-month'));
      }

      const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      for (let day = 1; day <= daysInCurrentMonth; day++) {
        this.days.push(this.createDayCell(day, 'current-month'));
      }
    },
    createDayCell(day, monthClass) {
      return {
        number: day,
        monthClass: monthClass,
        title: `${day}日: タスクはまだ完了していません`
      };
    },
    fetchAndRenderContributions() {
      const endpoint = `/users/${this.userId}/contribution`;

      this.$http.get(endpoint, { params: { user_id: this.userId } })
        .then(response => {
          this.updateContributionGrid(response.data);
        })
        .catch(error => {
          console.error('Error fetching completed tasks data', error);
        });
    },
    updateContributionGrid(data) {
      for (let date in data) {
        const taskCount = data[date];
        const dayNumber = new Date(date).getDate();

        const day = this.days.find(day => day.number === dayNumber);
        if (day) {
          day.title = `${date}日: ${taskCount}タスク完了`;
          day.monthClass += ' ' + this.determineColorClass(taskCount);
        }
      }
    },
    determineColorClass(taskCount) {
      if (taskCount < 3) return 'color-level-1';
      if (taskCount < 6) return 'color-level-2';
      return 'color-level-3';
    },
    showTooltip(event, day) {
      const offset = event.target.getBoundingClientRect();
      this.tooltip = {
        visible: true,
        title: day.title,
        top: offset.top + event.target.offsetHeight,
        left: offset.left
      };
    },
    hideTooltip() {
      this.tooltip.visible = false;
    }
  }
}
</script>

<style scoped>
  #weekday-headers, .day-cell {
    display: inline-block;
    width: calc(100% / 7);
    text-align: center;
    box-sizing: border-box;
  }
  
  #weekday-headers div, .day-cell {
    border: 1px solid #ddd;
    padding: 10px;
    height: 80px;
  }
  
  .tooltip {
    position: absolute;
    opacity: 0;
    background: #696969;
    color: white;
    border: 1px solid black;
    border-Radius: 4px;
    padding: 5px;
  }
  
  .day-cell {
    vertical-align: top;
    cursor: pointer;
  }
  
  .color-level-1 { background-color: #e0f7fa; }
  .color-level-2 { background-color: #80deea; }
  .color-level-3 { background-color: #26c6da; }
</style>
