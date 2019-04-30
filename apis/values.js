//Mission Types
export const MISSION_TYPES = {
    UGV: 1,
    UAV: 2,
    UMV: 3
};

//Roles for Each Mission
export const MISSION_ROLES = {
    1: {
        OPERATOR: {
            ID: 1,
            abbr: 'OPR',
            value: 'Operator'
        },
        MISSION_SPECIALIST: {
            ID: 2,
            abbr: 'MS',
            value: 'Mission Specialist'
        },
        SAFETY_OFFICER: {
            ID: 3,
            abbr: 'SO',
            value: 'Safety Officer'
        },
        OTHER: {
            ID: 4,
            abbr: 'OTH',
            value: 'Other'
        }
    },
    2: {
        RPIC: {
            ID: 5,
            abbr: 'RPIC',
            value: 'RPIC'
        },
        PILOT: {
            ID: 6,
            abbr: 'PLT',
            value: 'Pilot'
        },
        MISSION_SPECIALIST: {
            ID: 7,
            abbr: 'MS',
            value: 'Mission Specialist'
        },
        VISUAL_OBSERVER: {
            ID: 8,
            abbr: 'VO',
            value: 'Visual Observer'
        },
        OTHER: {
            ID: 9,
            abbr: 'OTH',
            value: 'Other'
        }
    },
    3: {
        OPERATOR: {
            ID: 10,
            abbr: 'OPR',
            value: 'Operator'
        },
        PAYLOAD_OPERATOR_AWL: {
            ID: 11,
            abbr: 'POA',
            value: 'Payload Operator AWL'
        },
        PAYLOAD_OPERATOR_BWL: {
            ID: 12,
            abbr: 'POB',
            value: 'Payload Operator BWL'
        },
        SAFETY_OFFICER: {
            ID: 13,
            abbr: 'SO',
            value: 'Safety Officer'
        },
        OTHER: {
            ID: 14,
            abbr: 'OTH',
            value: 'Other'
        }
    }
};

export const ROLES_TYPES = {
    1: {
        abbr: 'OPR',
        value: 'Operator'
    },
    2: {
        abbr: 'MS',
        value: 'Mission Specialist'
    },
    3: {
        abbr: 'SO',
        value: 'Safety Officer'
    },
    4: {
        abbr: 'OTH',
        value: 'Other'
    },
    5: {
        abbr: 'RPIC',
        value: 'RPIC'
    },
    6: {
        abbr: 'PLT',
        value: 'Pilot'
    },
    7: {
        abbr: 'MS',
        value: 'Mission Specialist'
    },
    8: {
        abbr: 'VO',
        value: 'Visual Observer'
    },
    9: {
        abbr: 'OTH',
        value: 'Other'
    },
    10: {
        abbr: 'OPR',
        value: 'Operator'
    },
    11: {
        abbr: 'POA',
        value: 'Payload Operator AWL'
    },
    12: {
        abbr: 'POB',
        value: 'Payload Operator BWL'
    },
    13: {
        abbr: 'SO',
        value: 'Safety Officer'
    },
    14: {
        abbr: 'OTH',
        value: 'Other'
    }
};


export const ROLE_MAPS = {
    1: {
        1: 'Operator',
        2: 'Mission Specialist',
        3: 'Safety Officer',
        4: 'Other'
    },
    2: {
        5: 'RPIC',
        6: 'Pilot',
        7: 'Mission Specialist',
        8: 'Visual Observer',
        9: 'Other'
    },
    3: {
        10: 'Operator',
        11: 'Payload Operator AWL',
        12: 'Payload Operator BWL',
        13: 'Safety Officer',
        14: 'Other'
    }
};

export const rowVals = ['slips', 'mistakes', 'distracted', 'confused', 'frustration', 'asked questions', 'bugs', 'equipment problems', 'ergonomics'];

export const STEPS = {
    PRE_MISSION: 1,
    MISSION_EXECUTION: 2,
    POST_MISSION: 3
};


export const FLOWS = {
    NEW: 1,
    LIBRARY: 2,
    RESUME: 3,
    BACK_PRESS: 4
};