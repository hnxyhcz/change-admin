import { useState } from "react"
import { BasicAnswer, CarotidAnswer } from "@/pages/quesnaire/data";
import { useAsync } from "@ahooksjs/use-request";
import { basicUqsById, carotidUqsById, saveBasicUqs, saveCarotidUqs } from "@/services/rms/quesnaire";

export default () => {
  const [basicAnswer, setBasicAnswer] = useState<BasicAnswer>();
  const [carotidAnswer, setCarotidAnswer] = useState<CarotidAnswer>();

  /**
   * 最近一次的常规问卷
   * @returns 
   */
  const getRecentBasicUqs = () => {
    const answer = localStorage.getItem("basicAnswer");
    if (answer) {
      return JSON.parse(answer);
    }
    return;
  }

  /**
   * 根据id获取常规问卷
   */
  const fetchBasicUqsById = useAsync(async (basicId: string) => {
    // 获取缓存
    const answer = getRecentBasicUqs();
    if (answer) {
      setBasicAnswer(answer);
      return {
        code: 200,
        data: answer,
      };
    }
    // 调用接口查询
    const resp = await basicUqsById(basicId);
    if (resp.code === 200) {
      setBasicAnswer(resp.data);
    }
    return resp;
  }, {manual: true})

  /**
   * 根据id获取问卷
   */
  const fetchCarotidUqsById = useAsync(async (carotidId: string) => {
    const resp = await carotidUqsById(carotidId);
    if (resp.code === 200) {
      setCarotidAnswer(resp.data);
    }
    return resp;
  }, {manual: true})

  /**
   * 保存常规问卷
   */
  const saveBasicAnswer = useAsync(async (answer: BasicAnswer) => {
    const resp = await saveBasicUqs(answer);
    if (resp.code === 200) {
      setBasicAnswer({ ...answer, id: resp.data });
      if (answer.plat > 16) {
        // 缓存答案
        localStorage.setItem("basicAnswer", JSON.stringify({ ...answer, id: resp.data }));
      }
    }
    return resp;
  }, {manual: true})

  /**
   * 保存颈动脉超声问卷
   */
  const saveCarotidAnswer = useAsync(async (answer: CarotidAnswer) => {
    const resp = await saveCarotidUqs(answer);
    if (resp.code === 200) {
      setCarotidAnswer({ ...answer, id: resp.data });
      // 清除缓存
      localStorage.removeItem("basicAnswer")
    }
    return resp;
  }, {manual: true})

  return {
    basicAnswer,
    carotidAnswer,
    setBasicAnswer,
    setCarotidAnswer,
    saveBasicAnswer,
    saveCarotidAnswer,
    fetchBasicUqsById,
    fetchCarotidUqsById,
    getRecentBasicUqs,
  };
}