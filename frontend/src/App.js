import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import {
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend,
} from 'recharts';

import moment from 'moment'

class App extends Component {
    constructor() {
        super()
        this.state = {
            message: [],
            endpoint: "34.66.219.157" // เชื่อมต่อไปยัง url ของ realtime server
        }
    }

    componentDidMount = () => {
        const { endpoint, message } = this.state
        const temp = message
        const socket = socketIOClient(endpoint)
        socket.on('new-message', (messageNew) => {
            temp.push(messageNew)
            this.setState({ message: temp })
        })
    }

    render() {
        const { message } = this.state
        const data = []
        message.forEach(m => {
          let text = m.tweets
            if (text && typeof text === 'string' && text.toUpperCase().includes('#TRADEWAR')) {
                let time = m.time / 1000
                let unixTime = moment.unix(time).format('HH:mm')
                const findData = data.find(d => d.time === unixTime)
                if(findData){
                  findData.count++
                }
                else{
                  data.push({time: unixTime ,count: 1})
                }
            }
        })



      
          return (
            <LineChart
              width={1080}
              height={300}
              data={data}
              margin={{
                top: 20, right: 30, left: 50, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey = "time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          );
        }
      } 

export default App
