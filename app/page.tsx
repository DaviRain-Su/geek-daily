import Navigation from './components/Navigation';

export default async function Home() {
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

  return renderData(allData);
}

function renderData(data: any[]) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <Navigation />
    <div className="container mx-auto py-24 px-4">
      {(
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item: any) => (
            <a
              key={item.id}
              href={item.attributes.url}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-primary transition duration-300 line-clamp-2">
                  {item.attributes.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {item.attributes.introduce}
                </p>
                <div className="mt-4 flex items-center text-primary">
                  <span className="text-sm font-medium">Read more</span>
                  <svg
                    className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  </main>
  );
}