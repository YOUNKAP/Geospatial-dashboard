import {useEffect} from 'react'

export default function Coordinate(props) {

    let long, lat
    long = props.long
    lat = props.lat

    
    if (long != 0 && long != undefined && long != 'Not Set'){
        long =  parseFloat(props.long).toFixed(3)
        lat = parseFloat(props.lat).toFixed(3)
    }

   

    return (
        <div className="coordinate-cursor">
            <p>Longitude : {long} <br/> Latitude : {lat} </p>
        </div>
    )
}