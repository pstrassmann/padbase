import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useRef, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useAlerts = () => {
  const [alertsArray, setAlertsArray] = useState([]);
  const alertsRef = useRef(alertsArray);

  useEffect(() => {
    alertsRef.current = alertsArray;
  });

  useEffect(() => {
    // Clear any unfinished timeouts on component unmount
    return () => {
      alertsRef.current.forEach((alertObj) => {
        clearTimeout(alertObj.timer);
      });
      setAlertsArray([]);
    };
  }, [setAlertsArray]);

  const addAlerts = (arrayOfNewAlerts) => {
    /* Takes an array of alerts of form:
     * {alertMsg: "", alertClass: "", alertIcon: faIcon}.
     * Maps a unique id to each alert and stores list of alert ids. These ids are checked against
     * in a timer closure for removing after the specified duration.
     * Alert class options:
     *    1) "alertSuccess"
     *    2) "alertError" */

    const timeoutDur = 4000;
    const uids = [];
    const alertsArrayWithId = arrayOfNewAlerts.map((alert) => {
      const uid = uuidv4();
      alert.uid = uid;
      uids.push(uid);
      return alert;
    });
    const newAlerts = alertsArrayWithId.map(({ alertMsg, alertClass, alertIcon, uid }) => {
      const timer = setTimeout(
        () => setAlertsArray(alertsRef.current.filter((alertObj) => !uids.includes(alertObj.uid))),
        timeoutDur
      );
      return { uid: uid, timer: timer, msg: alertMsg, class: alertClass, icon: alertIcon };
    });
    setAlertsArray([...newAlerts, ...alertsRef.current]);
  };

  const alertTransitions = useTransition(alertsArray, {
    trail: 50,
    from: { transform: 'translateX(-25%)', opacity: 0 },
    enter: { transform: 'translateX(0px)', opacity: 1 },
    leave: { transform: 'translateX(30%)', opacity: 0 },
    keys: (alertObj) => alertObj.uid,
  });

  const animatedAlerts = alertTransitions((style, alertObj) => {
    return (
      <animated.div style={style} className={alertObj.class}>
        <FontAwesomeIcon icon={alertObj.icon} />
        {alertObj.msg}
      </animated.div>
    );
  });

  return [addAlerts, animatedAlerts];
};

export default useAlerts;
