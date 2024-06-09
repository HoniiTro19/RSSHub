import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { load } from 'cheerio';

export const route: Route = {
    path: '/nr/:np/:type',
    categories: ['traditional-media'],
    example: '/zhongguoxiqu/nr/0_639_37',
    parameters: { np: 'Number of content' },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },

    radar: [
        {
            source: [],
            target: '/nr/:np',
        },
    ],

    name: 'Opera Content',
    maintainers: ['HoniiTro19'],
    handler: async (ctx) => {
        const { np, type } = ctx.req.param();
        const response = await ofetch(`http://zhongguoxiqu.cn/nr.jsp?_np=${np}`);
        const $ = load(response);

        const items = $('#newsList31 .J_newsResultLine')
        .toArray()
        .map((item) => {
            item = $(item);
            const titleElement = item.find('a.J_mixNewsStyleTitle').first();
            const title = titleElement.text().trim();
            const link = titleElement.attr('href');
            const description = item.find('p.mixNewsStyleSummary').text().trim();
            const category = item.find('.J_newsTypePicList a').toArray().map((category) => $(category).text().trim());

            return {
                title,
                link,
                description,
                category,
            };
        });
      
        return {
            title: `${type} | 中国戏曲网`,
            link: `http://zhongguoxiqu.cn/nr.jsp?_np=${np}`,
            item: items,
        };
    },
};