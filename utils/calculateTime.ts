export default (start_time: any, end_time: any) => {
  const startHours = parseInt(start_time.split(":")[0]);
  const startMinutes = parseInt(start_time.split(":")[1]);
  const endHours = parseInt(end_time.split(":")[0]);
  const endMinutes = parseInt(end_time.split(":")[1]);
  const endTime = new Date();
  endTime.setHours(endHours);
  endTime.setMinutes(endMinutes);
  const startTime = new Date();
  startTime.setHours(startHours);
  startTime.setMinutes(startMinutes);
  const timeDiffMs = endTime.getTime() - startTime.getTime();
  const timeDiff = new Date(timeDiffMs);

  const hours = timeDiff.getUTCHours().toString().padStart(2, "0");
  const minutes = timeDiff.getUTCMinutes().toString().padStart(2, "0");
  //console.log(minutes/60);
  const result = hours;
  return result;
};
