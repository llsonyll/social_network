/* import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
	number: 0,
	datos: [],
}

const toSumSlice = createSlice({
	name: 'toSum',
	initialState,
	reducers: {
		SumOne(state, action) {
			let num = state.number

			return {
				...state,
				number: num + 1,
			}
		},
		SubtractOne(state, action) {
			state.number = state.number - 1 // ESTA ES LA MEJOR FORMA, "SOLO CAMBIO ES ESTADO DIRECTAMENTE", EN REALIDAD NO LO CAMBIA DIRECTAMENTE, PERO PARECIERA QUE SI
		},
		AddAsyncNumber(state, action) {
			console.log(action.payload)
			state.datos = action.payload
		},
	},
})

export const { SumOne, SubtractOne, AddAsyncNumber } = toSumSlice.actions

export default toSumSlice.reducer
 */
