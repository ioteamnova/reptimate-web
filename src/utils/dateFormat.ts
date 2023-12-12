export function formatTimeDifference(uploadDate: Date): string {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - uploadDate.getTime();
  
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
  
    if (diffInMilliseconds < minute) {
      const seconds = Math.floor(diffInMilliseconds / 1000);
      return `${seconds}초 전`;
    } else if (diffInMilliseconds < hour) {
      const minutes = Math.floor(diffInMilliseconds / minute);
      return `${minutes}분 전`;
    } else if (diffInMilliseconds < day) {
      const hours = Math.floor(diffInMilliseconds / hour);
      return `${hours}시간 전`;
    } else if (diffInMilliseconds < month) {
      const days = Math.floor(diffInMilliseconds / day);
      return `${days}일 전`;
    } else {
      const months = Math.floor(diffInMilliseconds / month);
      return `${months}달 전`;
    }
  }
  export function formatViews(views: number): string {
    if (views < 1000) {
      return `${views.toString()}회`;
    } else if (views < 10000) {
      return `${(views / 1000).toFixed(1)}천`;
    } else if (views < 100000000) {
      return `${Math.floor(views / 10000)}만`;
    } else {
      return `${(views / 100000000).toFixed(1)}억`;
    }
  }