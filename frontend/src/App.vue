<!--App.vue-->
<template>
  <v-app>
    <v-app-bar app> GitHub Most Starred Repositories App </v-app-bar>
    <v-main>
      <v-container>
        <v-data-table
          :headers="headers"
          :items="repositories"
          :options.sync="options"
          :loading="loading"
          :server-items-length="totalItems"
          :footer-props="{
            itemsPerPageOptions: [15, 20, 25]
          }"
        >
          <template v-slot:item.full_name="{ item }">
            <span
              >{{ item.full_name.split('/')[0] }} / <strong>{{ item.full_name.split('/')[1] }}</strong></span
            >
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn v-if="starredRepoIds.indexOf(item.id) === -1" icon @click="star(item)">
              <v-icon>mdi-star-outline</v-icon>
            </v-btn>
            <v-btn v-else icon @click="unstar(item)">
              <v-icon>mdi-star</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.html_url="{ item }">
            <a target="_blank" :href="item.html_url"><span>GitHub</span></a>
          </template>
        </v-data-table>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: '', value: 'action', sortable: false },
        { text: 'Repository', value: 'full_name', sortable: false },
        {
          text: 'Description',
          align: 'start',
          sortable: false,
          value: 'description'
        },
        { text: 'Stars', value: 'stargazers_count', sortable: false },
        { text: 'Language', value: 'language', sortable: false },
        { text: 'Link', value: 'html_url', sortable: false }
      ],
      loading: false,
      repositories: [],
      options: {},
      totalItems: 0,
      starredRepoIds: []
    }
  },
  watch: {
    options: {
      handler() {
        this.getData()
      },
      deep: true
    }
  },
  created() {
    this.loading = true
    Promise.all([this.getData(), this.fetchStarredRepoIds()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    async unstar(item) {
      if (await this.transferStarState(item.full_name, 'DELETE')) {
        this.starredRepoIds = this.starredRepoIds.filter(id => id !== item.id)
      }
    },
    async star(item) {
      if (await this.transferStarState(item.full_name, 'PUT')) {
        this.starredRepoIds.push(item.id)
      }
    },
    async transferStarState(full_name, method) {
      let response = await fetch('http://localhost:3000/user/starred/' + full_name, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.ok
    },
    async fetchStarredRepoIds() {
      try {
        let response = await fetch('http://localhost:3000/user/starred')
        let data = await response.json()
        this.starredRepoIds = data.repoIds
      } catch (e) {
        console.warn(e)
      }
    },
    async getData() {
      let url = 'http://localhost:3000/repositories'
      if (this.options.page) {
        url += '?page=' + this.options.page
      }
      if (this.options.itemsPerPage) {
        url += '&itemsPerPage=' + this.options.itemsPerPage
      }
      try {
        let response = await fetch(url)
        let data = await response.json()
        this.totalItems = data.total_count
        this.repositories = data.items
      } catch (e) {
        console.warn(e)
      }
    }
  }
}
</script>
