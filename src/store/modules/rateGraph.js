const state = {
  rankData: [],
  selectedTable: '',
  weights: {
    flag2: 1,
    flag3: 1,
    flag4: 1,
    flag5: 1
  },
  dataLoaded: false
}

const mutations = {
  SET_RANK_DATA: (state, data) => {
    state.rankData = data
  },
  SET_SELECTED_TABLE: (state, table) => {
    state.selectedTable = table
  },
  SET_WEIGHTS: (state, weights) => {
    state.weights = weights
  },
  SET_DATA_LOADED: (state, loaded) => {
    state.dataLoaded = loaded
  },
  RESET_WEIGHTS: (state) => {
    state.weights = {
      flag2: 1,
      flag3: 1,
      flag4: 1,
      flag5: 1
    }
  }
}

const actions = {
  updateRankData({ commit }, data) {
    commit('SET_RANK_DATA', data)
    commit('SET_DATA_LOADED', true)
    console.log(data)
  },
  selectTable({ commit }, table) {
    commit('SET_SELECTED_TABLE', table)
  },
  updateWeights({ commit }, weights) {
    commit('SET_WEIGHTS', weights)
  },
  resetWeights({ commit }) {
    commit('RESET_WEIGHTS')
  },
  clearData({ commit }) {
    commit('SET_RANK_DATA', [])
    commit('SET_SELECTED_TABLE', '')
    commit('RESET_WEIGHTS')
    commit('SET_DATA_LOADED', false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
