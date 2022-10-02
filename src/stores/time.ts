import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import locale from "dayjs/locale/pt-br";

dayjs.extend(relativeTime);

export function useTime(locale: string, time: string) {
	return dayjs(time).locale(locale).fromNow();
}
