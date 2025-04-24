import { useEffect, useState } from "react";
import {getOTPTokens} from "../../../../http/requests/admin";

export default function Settings() {
  const [tokenList, setTokenList] = useState<any[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
      const data = await getOTPTokens();
      setTokenList(data);
    };
    fetchTokens();
  }, []);

  return (
    <div className="overflow-x-auto">
        <h1 className="text-xl px-4 font-bold">Bu sayfa ayarlar sayfasıdır</h1>
        <h2 className="text-md p-4">Geçici olarak token listesini göstermek için kullanılacak</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Telefon</th>
            <th className="px-4 py-2 border">Token</th>
            <th className="px-4 py-2 border">Oluşturulma Tarihi</th>
            <th className="px-4 py-2 border">Geçerlilik Tarihi</th>
          </tr>
        </thead>
        <tbody>
          {tokenList.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-sm">{item.telephone}</td>
              <td className="px-4 py-2 border text-sm">{item.token}</td>
              <td className="px-4 py-2 border text-sm">
                {new Date(item.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-sm">
                {new Date(item.expire).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
