<template id="main">
    <v-ons-page>
        <v-ons-toolbar style="background-color: #62b8f1;">
        <div class="center" style="color: white;">{{ title }}</div>
        </v-ons-toolbar>

        <v-ons-tabbar swipeable
        tabbar-style="background-color: #62b8f1;"
        :tabs="tabs"
        :visible="true"
        :index.sync="activeIndex"
        :position="position"
        >

        </v-ons-tabbar>
    </v-ons-page>
</template>

<style>
.tabbar--material__button {
  color: white !important;
}
</style>

<script>
import ListaDeHorarios from '@/components/ListaDeHorarios'
import ListaDeRegras from '@/components/ListaDeRegras'

export default {
  components: {
    ListaDeHorarios,
    ListaDeRegras
  },
  beforeMount(){
    this.getTabIndex()
  },
  data() {
    return {
      openSide: false,
      activeIndex: this.$root.$data.index,
      position: 'bottom',
      tabs: [
        {
            icon: 'md-calendar-note',
            label: 'Horários',
            page: ListaDeHorarios,
            props: {
                myProp: 'This is a page prop!'
            },
            key: "horariosPage"
        },
        {
            icon: 'md-calendar',
            label: 'Regras',
            page: ListaDeRegras,
            props: {
                myProp: 'This is a page prop!'
            },
            key: "novoHorariosPage"
        }
      ]
    };
  },
  methods: {
    getTabIndex(){
      this.activeIndex =  this.$root.$data.index;
    }

    
  },
  computed: {
    title() {
      return this.tabs[this.activeIndex].label;
    }
  } 
}
</script>


