import {ROLES_TYPES, MISSION_TYPES} from "../apis/values";

export function getDataByPhase(value, sortieName) {
    // let sortieInfo = value.sorties[sortieName];
    let phases = {};
    let phaseVals = ['premission', 'mission', 'postmission'];
    phases['premission'] = new Array(9).fill(0);
    phases['mission'] = new Array(9).fill(0);
    phases['postmission'] = new Array(9).fill(0);
    value.timeStamps.map((timeStampObj, index) => {
        // let timeStampObj = sortieInfo.timeStamps[index];
        phases[phaseVals[timeStampObj.step - 1]][timeStampObj.event] += 1;
    });
    return phases;
}

export function getDataByRole(value, sortieName) {
    // let sortieInfo = value.sorties[sortieName];
    let roles = {};
    for(let i = 1; i<=value.roles.length; i++) {
        let varName = "role_" + i;
        roles[varName] = new Array(9).fill(0);
    }
    let tempRoleMap = {}
    value.roles.map((role, index) => {
        let varName = "role_" + (index + 1);
        let roleName = ROLES_TYPES[role.title].abbr;
        tempRoleMap[roleName] = index + 1;
        roles[varName] = new Array(9).fill(0);
    });
    value.timeStamps.map((timeStampObj, index) => {
        // let timeStampObj = sortieInfo.timeStamps[index];
        let roleKey = tempRoleMap[timeStampObj.role];
        let varName = "role_" + roleKey;
        roles[varName][timeStampObj.event] += 1;
    });
    // roles.role_1[0] -= 1;
    return roles;
}

export function getRoleHeaders(roleIds, db) {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            let roleData = [];
            let x = 0;
            let numberOfRoles = Object.keys(roleIds).length;
            let loopInsert = function() {
                let roleName = "Role " + (x+1).toString();
                txn.executeSql("SELECT * FROM table_roles WHERE role_id = ?", [roleIds[roleName]], (txn, results) => {
                    let role = results.rows.item(0);
                    roleData.push(role.role_name + "-" + ROLES_TYPES[role.role_type].abbr);
                    x++;
                    if(x < numberOfRoles) {
                        loopInsert();
                    }
                    else {
                        resolve(roleData);
                    }
                })
            };
            loopInsert();
        });
    })
}

export function getPrefillValue(missionData, sortieName, newFlight) {
    let temp = {
        sessionName: missionData.sessionName,
        sessionDescription: missionData.sessionDescription,
        missionName: missionData.missionName,
        missionDescription: missionData.missionDescription,
        sortieName: !newFlight ? sortieName: '',
        role_1: {},
        role_2: {},
        role_3: {},
        role_4: {},
        role_5: {}
    };
    if(!newFlight){
        temp["location"] = missionData.sorties[sortieName].location;
    }
    let sortieInfo = !newFlight ? missionData.sorties[sortieName] : missionData.sorties[Object.keys(missionData.sorties)[0]];
    for(let i = 1; i<=5; i++){
        let varName = "role_" + i;
        if (sortieInfo[varName]) {
            temp[varName]["name"] =sortieInfo[varName].name;
            temp[varName]["title"] =sortieInfo[varName].title;
            temp[varName]["abbreviation"] =sortieInfo[varName].abbreviation;
        }
        else
            temp[varName] = null;
    }
    return temp;
}

export function setupGridVals(sortieData, sortieName) {
    return new Promise((resolve, reject) => {
        let timeStamps = sortieData[sortieName].timeStamps.slice();
        let count = 0;
        for(let x in sortieData[sortieName]) {
            if (!sortieData[sortieName].hasOwnProperty(x)) continue;
            if(x.startsWith('role') && sortieData[sortieName][x] != null){
                count++;
            }
        }
        let gridVals = {
            premission: [],
            mission: [],
            postmission: []
        };
        for(let i=0; i<8; i++) {
            let temp = [];
            for(let j=0;j<count;j++){
                temp.push(0);
            }
            gridVals.premission.push(temp.slice());
            gridVals.mission.push(temp.slice());
            gridVals.postmission.push(temp.slice());
        }
        for(let index in timeStamps) {
            let timeStamp = timeStamps[index];
            switch (timeStamp.step) {
                case 'premission':
                    gridVals.premission[timeStamp.event][timeStamp.role] += 1;
                    break;
                case 'mission':
                    gridVals.mission[timeStamp.event][timeStamp.role] += 1;
                    break;
                case 'postmission':
                    gridVals.postmission[timeStamp.event][timeStamp.role] += 1;
                    break;
            }
        }
        resolve(gridVals);
    });
}

export function getSummaryDetails(value, sortieName) {
    let temp = {
        sessionName: value.eventName,
        sessionDescription: value.eventDescription,
        missionName: value.missionName,
        missionDescription: value.missionDescription,
        missionObservations: value.missionObservations,
        missionType: value.missionType,
        sortieName: value.sortieName,
        sortieObservation: value.sortieObservation,
        roles: value.roles,
        // location: convertDMS(parseFloat(value.sorties[sortieName].location.latitude), parseFloat(value.sorties[sortieName].location.longitude))
    };
    // let sortieInfo = value.roles;
    // for(let i = 1; i<=5; i++){
    //     let varName = "role_" + i;
    //     if (sortieInfo[varName]) {
    //         let temprole = {};
    //         temprole["name"] = sortieInfo[varName].name;
    //         temprole["title"] = sortieInfo[varName].title;
    //         // temprole["abbreviation"] = sortieInfo[varName].abbreviation;
    //         temp.roles.push(temprole);
    //     }
    // }
    return temp;
}

export function generateSummaryData(sortieId, db) {
    return new Promise((resolve, reject) => {
        let summaryData = {};
        db.transaction((txn) => {
            txn.executeSql("SELECT * FROM table_sorties WHERE sortie_id = ?", [sortieId], (txn, sortieResults) => {
                let sortieData = sortieResults.rows.item(0);
                summaryData['sortieName'] = sortieData.sortie_name;
                summaryData['sortieObservation'] = sortieData.sortie_observation;
                summaryData['sortieLocation'] = sortieData.sortie_location;
                let missionId = sortieData.mission_id;
                txn.executeSql("SELECT * FROM table_missions WHERE mission_id = ?", [missionId], (txn, missionResults) => {
                    let missionData = missionResults.rows.item(0);
                    summaryData['missionName'] = missionData.mission_name;
                    summaryData['missionObservations'] = missionData.mission_observations;
                    summaryData['missionDescription'] = missionData.mission_description;
                    let missionType = null;
                    switch (missionData.mission_type) {
                        case MISSION_TYPES.UAV:
                            missionType = "UAV";
                            break;
                        case MISSION_TYPES.UGV:
                            missionType = "UGV";
                            break;
                        case MISSION_TYPES.UMV:
                            missionType = "UMV";
                            break;
                        default:
                            missionType = "Not Applicable"
                    }
                    summaryData['missionType'] = missionType;
                    let eventId = missionData.event_id;
                    txn.executeSql("SELECT * FROM table_events WHERE event_id = ?", [eventId], (txn, eventResults) => {
                        let eventData = eventResults.rows.item(0);
                        summaryData['eventName'] = eventData.event_name;
                        summaryData['eventDescription'] = eventData.event_description;
                        txn.executeSql("SELECT * FROM table_roles WHERE sortie_id = ?", [sortieId], (txn, roleResults) => {
                            let roles = roleResults.rows;
                            let numberOfRoles = roles.length;
                            let roleData = [];
                            let roleDict = {};
                            for(let x =0; x<numberOfRoles; x++) {
                                let tempRole = {
                                    name: roles.item(x).role_name,
                                    title: roles.item(x).role_type
                                };
                                roleData.push(tempRole);
                                roleDict[roles.item(x).role_id] = tempRole;
                            }
                            summaryData['roles'] = roleData;
                            txn.executeSql("SELECT * FROM table_observations WHERE sortie_id = ?", [sortieId], (txn, observationResults) => {
                                let observationData = observationResults.rows;
                                let numberOfObservations = observationData.length;
                                let timeStamps = [];
                                for(let x = 0; x<numberOfObservations; x++) {
                                    let tempObservation = {
                                        timeStamp: observationData.item(x).timestamp,
                                        role: ROLES_TYPES[roleDict[observationData.item(x).role_id].title].abbr,
                                        step: observationData.item(x).step,
                                        event:observationData.item(x).event,
                                        name: roleDict[observationData.item(x).role_id].name
                                    };
                                    timeStamps.push(tempObservation);
                                }
                                summaryData['timeStamps'] = timeStamps;
                                console.log(summaryData);
                                resolve(summaryData);
                            })
                        })
                    })
                })
            })
        })
    })
}

function toDegreesMinutesAndSeconds(coordinate) {
    let absolute = Math.abs(coordinate);
    let degrees = Math.floor(absolute);
    let minutesNotTruncated = (absolute - degrees) * 60;
    let minutes = Math.floor(minutesNotTruncated);
    let seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + "\xB0 " + minutes + "\' " + seconds + "\" ";
}

export function convertDMS(lat, lng) {
    if(!lat)
        return 'Location not available';
    else {
        let latitude = toDegreesMinutesAndSeconds(lat);
        let latitudeCardinal = Math.sign(lat) >= 0 ? "N" : "S";

        let longitude = toDegreesMinutesAndSeconds(lng);
        let longitudeCardinal = Math.sign(lng) >= 0 ? "E" : "W";

        return latitude + " " + latitudeCardinal + "  " + longitude + " " + longitudeCardinal;
    }
}

export function getFormattedLabel(string) {
    if(string.length < 8)
        return string;
    else
        return string.slice(0, 6) + '..';
}