import Navigation from './components/Navigation';

export default async function Latest() {
  const CACHE_KEY = 'geekdailies_data';
  const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 缓存过期时间：24小时

  // 从缓存中获取数据
  let cachedData = null;
  if (typeof window !== 'undefined') {
    cachedData = localStorage.getItem(CACHE_KEY);
  }

  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
      // 如果缓存未过期，直接使用缓存数据
      return renderData(data);
    }
  }

  // 如果缓存不存在或已过期，从 API 获取数据
  const pageSize = 100;
  let page = 1;
  let allData: any[] = [];

  while (true) {
    const res = await fetch(`https://db.rebase.network/api/v1/geekdailies?pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    const data = await res.json();

    if (data.data.length === 0) {
      break;
    }

    allData = [...allData, ...data.data];
    page++;
  }

  // 将数据存入缓存
  if (typeof window !== 'undefined') {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: allData, timestamp: Date.now() }));
  }

  // 按时间降序排列数据
  const sortedData = allData.sort((a, b) => new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime());

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navigation />
      <div className="py-24">
        {renderData(sortedData)}
      </div>
    </main>
  );
}

function renderData(data: any[]) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map((item: any) => (
        <a
          key={item.id}
          href={item.attributes.url}
          className="group flex flex-col rounded-lg border border-transparent p-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-2 text-xl font-semibold line-clamp-2">
            {item.attributes.title}{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="text-sm opacity-50 line-clamp-3">{item.attributes.introduce}</p>
        </a>
      ))}
    </div>
  );
}
