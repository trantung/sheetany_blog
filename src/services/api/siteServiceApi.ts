const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL_API;

export interface SiteInformation {
    property: string;
    value: string;
    code: string;
}

export interface Config {
    dark_mode: number;
    hide_header: number;
    hide_footer: number;
    disable_hero: number;
    collect_email: number;
    about_us: number;
    disable_auto_sync: number;
    feedback_form: number;
    text_center: number;
    small_hero: number;
    grid_content: number;
    pagination_size: number;
    font_family: string;
    published: number;
}

export interface CategoryRelate {
    category_id: number;
    category_name: string;
}

export interface Product {
    title: string;
    slug: string;
    excerpt: string;
    thumbnail: string;
    author: string;
    content: string;
    published_date: string;
    status: string;
    categories_relate: CategoryRelate[];
}

export interface Category {
    category_id: number;
    category_name: string;
    products: Product[];
}

export interface NavbarItem {
    title: string;
    link: string;
    icon?: string;
    target: number;
    nav_bar_id: number;
}

export interface PageItem {
    title: string;
    content: string;
    page_address: string;
    page_width: string;
    menu_title: string;
    menu_type: number;
    target: number;
    show_in_header: number;
    meta_title: string;
    meta_description: string;
    image_share_url: string;
    show_in_search: number;
}

export interface Header {
    nar_bars: NavbarItem[];
    pages: PageItem[];
}

export interface SiteData {
    site_informations: SiteInformation[];
    configs: Config;
    categories: Category[];
    header: Header;
}

export interface ApiResponse {
    status: boolean;
    data: SiteData;
}

export interface ProductItem {
    id: number
    title: string
    slug: string
    excerpt: string
    thumbnail: string
    author: string
    content: string
    published_date: string
    status: string
    category_relate: CategoryRelate[]
}

export interface ProductDetailResponse {
    detail: ProductItem[]
    product_relate: ProductItem[]
}

export interface SearchProductResponse {
    products: ProductItem[];
}

export interface PageDetail {
    id: number;
    title: string;
    content: string;
    page_address: string;
    page_width: string;
    menu_title: string;
    menu_type: number;
    target: number;
    show_in_header: number;
    meta_title: string | null;
    meta_description: string | null;
    image_share_url: string | null;
    show_in_search: number;
    created_at: string | null;
    updated_at: string | null;
}


class SiteServiceApi {
    private baseUrl: string;

    constructor() {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }
        this.baseUrl = API_BASE_URL as string;
    }

    getSiteInfoByCode(siteInfos: SiteInformation[] | undefined, code: string): string {
        if (!siteInfos || !Array.isArray(siteInfos)) return "";
        const info = siteInfos.find((item) => item.code === code);
        return info?.value || "";
    }

    async get(endpoint = ""): Promise<ApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("GET request failed:", error);
            throw error;
        }
    }

    async post<T = unknown, R = ApiResponse>(endpoint = "", data?: T): Promise<R> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data ? JSON.stringify(data) : undefined,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("POST request failed:", error);
            throw error;
        }
    }

    async put<T = unknown, R = ApiResponse>(endpoint: string, data: T): Promise<R> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("PUT request failed:", error);
            throw error;
        }
    }

    async delete<R = ApiResponse>(endpoint: string): Promise<R> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("DELETE request failed:", error);
            throw error;
        }
    }

    async getSiteData(): Promise<ApiResponse> {
        return this.post("/site/index");
    }

    async getProductDetail(slug: string): Promise<ProductDetailResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/product/detail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ slug })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (!result.status || !result.data) {
                return { detail: [], product_relate: [] } // Return empty arrays if no data found
            }

            return result.data as ProductDetailResponse
        } catch (error) {
            console.error("Failed to fetch product detail:", error)
            throw error
        }
    }

    async searchPosts(keyword: string): Promise<ProductItem[]> {
        try {
            const response = await fetch(`${this.baseUrl}/product/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ keyword }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.status || !result.data) {
                return []; // Return empty array if no data found
            }

            return result.data as ProductItem[];
        } catch (error) {
            console.error("Search product failed:", error);
            throw error;
        }
    }

    async getPageDetail(page_address: string): Promise<PageDetail> {
        try {
            const response = await fetch(`${this.baseUrl}/pages/detail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ page_address }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.status || !result.data) {
                return {} as PageDetail; // Return empty object if no data found
            }

            return result.data as PageDetail;
        } catch (error) {
            console.error("Failed to fetch page detail:", error);
            throw error;
        }
    }

}

export const siteServiceApi = new SiteServiceApi();