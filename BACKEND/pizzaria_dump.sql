--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id text NOT NULL,
    amount integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    order_id text NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "table" integer NOT NULL,
    status boolean DEFAULT false NOT NULL,
    draft boolean DEFAULT true NOT NULL,
    name text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id text NOT NULL,
    name text NOT NULL,
    price text NOT NULL,
    description text NOT NULL,
    banner text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    category_id text NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
902ff5d1-0cb9-45df-8a27-55445e0432e9	cb9e200be676db6676c9dc3fc8d1ad12835af24fa4a2899e46f90661c6cf884a	2025-06-03 10:22:01.943748-03	20250603132201_create_table_users	\N	\N	2025-06-03 10:22:01.933069-03	1
d20e1bab-e69d-4b31-b0b9-fd5e8b43a358	226536f77d6c9633730dfdec4394238bd825b81158966e9b2a1fd6f33af2b163	2025-06-03 10:51:37.807535-03	20250603135137_create_models_pizzaria	\N	\N	2025-06-03 10:51:37.788925-03	1
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at, update_at) FROM stdin;
8dfbf130-2df2-4953-a1fe-889fa3d486eb	bebidas	2025-06-16 17:34:11.524	2025-06-16 17:34:11.524
277e0d4c-bb57-47d5-9916-ffc347fe0371	pizzas	2025-06-16 17:35:13.135	2025-06-16 17:35:13.135
3fa2369a-fb8c-4d5d-8540-b02d30d348f1	sobremesas	2025-06-16 18:20:45.677	2025-06-16 18:20:45.677
44e28fd6-999e-4e0d-9713-563023a337ba	Sorvete	2025-06-23 13:39:10.407	2025-06-23 13:39:10.407
feb76ccc-1911-47c9-912a-d0af5901ae5b	espeto	2025-06-23 13:39:51.478	2025-06-23 13:39:51.478
55c9ac66-6ac1-4c84-8cc0-f763785675fc	hamburger	2025-06-23 13:40:21.29	2025-06-23 13:40:21.29
c54771d9-01c7-495f-9902-2dda57a9416a	acompanhamentos	2025-06-23 13:44:34.448	2025-06-23 13:44:34.448
0f139367-810c-456e-a897-99391b8b5eab	esfihas	2025-06-23 16:56:49.512	2025-06-23 16:56:49.512
0bf4cc77-0e66-42aa-8194-09ebb4ba1739	teste1	2025-06-23 19:01:14.505	2025-06-23 19:01:14.505
d8a794fa-caef-46fd-ae1a-0ed66635eee3	gelados	2025-06-23 19:38:00.003	2025-06-23 19:38:00.003
01e8605d-8f41-4682-9598-282def6fbbd9	Iniciais	2025-06-23 19:53:57.732	2025-06-23 19:53:57.732
751d5c50-2d4b-4b61-b56d-81d86ab04479	lanches	2025-06-24 10:48:17.303	2025-06-24 10:48:17.303
a6d189b8-cd5c-46d8-9417-07130935aee6	Sucos	2025-06-24 10:56:28.317	2025-06-24 10:56:28.317
b769bd18-99fd-4d40-973c-0db2cb9f2eb2	Tenis	2025-09-02 19:15:58.846	2025-09-02 19:15:58.846
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, amount, created_at, update_at, order_id, product_id) FROM stdin;
540da7f9-28f8-461d-b20c-de61e7bb9b6e	2	2025-06-17 13:58:44.406	2025-06-17 13:58:44.406	7a2dd7dd-fcc8-4505-aa77-ab5456fbfde3	fe3afec5-f210-4ecc-bb69-f121f2dd5d52
d4c5cb67-fd80-4b51-a317-222ea5387ee2	3	2025-06-17 14:28:17.856	2025-06-17 14:28:17.856	7a2dd7dd-fcc8-4505-aa77-ab5456fbfde3	11e7714b-ec04-4351-a81a-37468a245d9f
1738edb6-d12e-45c5-94aa-398c4f99569a	2	2025-06-23 19:04:36.174	2025-06-23 19:04:36.174	5f5053cb-a722-4c67-96b9-9f5b383d4431	d9f53e16-1a95-4dad-88d9-1ece5b1f1908
6d275601-b7a0-49da-96c2-04798cbfffcf	2	2025-06-24 10:52:21.838	2025-06-24 10:52:21.838	dd523a7b-83b8-4807-9584-63e96988c984	fe3afec5-f210-4ecc-bb69-f121f2dd5d52
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "table", status, draft, name, created_at, update_at) FROM stdin;
68085b8d-16fb-46c2-a3a2-daa238bc73f9	9	t	f	\N	2025-06-17 14:12:15.805	2025-06-17 14:12:15.805
5f5053cb-a722-4c67-96b9-9f5b383d4431	10	t	f	\N	2025-06-23 19:02:46.759	2025-06-23 19:02:46.759
7a2dd7dd-fcc8-4505-aa77-ab5456fbfde3	55	t	f	\N	2025-06-17 13:23:22.609	2025-06-17 13:23:22.609
dd523a7b-83b8-4807-9584-63e96988c984	30	t	f	\N	2025-06-24 10:51:30.792	2025-06-24 10:51:30.792
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, description, banner, created_at, update_at, category_id) FROM stdin;
11e7714b-ec04-4351-a81a-37468a245d9f	Pizza de calabresa	46	Pizza de calabresa saborosa	39bdfc3cdff3b095c73e4a018bb37f72-39bdfc3cdff3b095c73e4a018bb37f72-Pizza de calabresa.jpg	2025-06-16 19:33:25.382	2025-06-16 19:33:25.382	277e0d4c-bb57-47d5-9916-ffc347fe0371
fe3afec5-f210-4ecc-bb69-f121f2dd5d52	Coca lata	5	Coca-Cola lata 350ml	6513be39fdef6e1bd7e776dbb9d4d7ac-6513be39fdef6e1bd7e776dbb9d4d7ac-COCA COLA.jpg	2025-06-16 19:38:15.387	2025-06-16 19:38:15.387	8dfbf130-2df2-4953-a1fe-889fa3d486eb
3dfe1b51-5a25-4b56-b7f5-594df6f918a8	Coca-Cola 2L	10	Coca-Cola gelada 2L	29856e30464baf9405d1a900e0bf8f48-29856e30464baf9405d1a900e0bf8f48-Coca-cola2l.png	2025-06-17 12:06:08.703	2025-06-17 12:06:08.703	8dfbf130-2df2-4953-a1fe-889fa3d486eb
3257cef5-42bd-476a-b9b4-8d22f65ffa97	Dev Burguer Salada	40	Hamburguer de salada 160g	7d2af039b30e0debd57c6b7ebd5b34f3-7d2af039b30e0debd57c6b7ebd5b34f3-hamburguer.jpg	2025-06-23 18:16:24.92	2025-06-23 18:16:24.92	55c9ac66-6ac1-4c84-8cc0-f763785675fc
d9f53e16-1a95-4dad-88d9-1ece5b1f1908	Coca-Cola 2L 2	10	Coca-Cola gelada 2L	d378084863a0650dab69d0b4d5e14ff6-d378084863a0650dab69d0b4d5e14ff6-Coca-cola2l.png	2025-06-23 19:01:30.342	2025-06-23 19:01:30.342	8dfbf130-2df2-4953-a1fe-889fa3d486eb
0b780477-b5ab-4b85-9fa8-e18475ea9027	geladinho	10	afshga	b3085e548352737562e7e8edb99d7b46-b3085e548352737562e7e8edb99d7b46-gelin.jpg	2025-06-23 19:45:28.609	2025-06-23 19:45:28.609	d8a794fa-caef-46fd-ae1a-0ed66635eee3
7e7caa30-cfb5-4156-bc3e-99601b8b515a	Hot-dog	10	Hot-dog muito bom	024cf82844e7ee1641f824afddf09d33-024cf82844e7ee1641f824afddf09d33-Coca-cola2l.png	2025-06-24 10:50:08.19	2025-06-24 10:50:08.19	751d5c50-2d4b-4b61-b56d-81d86ab04479
1dddff23-aec6-46a5-b7c4-220b872130db	Suco de Limão	15	Suco saboroso	5641a0e55d3dd5f3d351326e223ca830-5641a0e55d3dd5f3d351326e223ca830-Coca-cola2l.png	2025-06-24 10:56:57.848	2025-06-24 10:56:57.848	a6d189b8-cd5c-46d8-9417-07130935aee6
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, update_at) FROM stdin;
6c76c6d2-24a5-41f2-9094-8fc5314bdbf6	Sujeito Programador	teste@teste.com	$2b$08$gW9U1VhpVQPFDJ5eo.bwAeyA7pLSMOPpOw5ErjRtTruUi6HF8I0Fe	2025-06-16 13:44:33.433	2025-06-16 13:44:33.433
c12b1ff2-b5f5-4764-8c37-0daeefd73524	Igor Nunes	igor@teste.com	$2b$08$OFwTWdwPx7ARisNsLbUj7O8CFLj5I8eDe8OrGRkxSO8Xx6/u3qEW6	2025-06-16 13:48:38.807	2025-06-16 13:48:38.807
501b9d1d-6993-42e1-ba81-c6205c0ce751	Almir Ante	almir@teste.com	$2b$08$Y.PHMNOyJVLRUIaGqXqkBep/ls7/./2flybhsUJOaDsyPqoDzuXCq	2025-06-16 16:42:26.087	2025-06-16 16:42:26.087
2b2afa1a-e227-463b-bf74-fd6fa5d32c88	Teste Ante	teste1@teste.com	$2b$08$bgqWpvJEApo5/aGT5/2cG.kxMMw3EsKpy4nZOF7jzQ9bjcqtiIW9u	2025-06-17 11:22:56.964	2025-06-17 11:22:56.964
564519c6-fe3c-4e5c-805c-fd45012262d7	Joel Villa	joel@teste.com	$2b$08$b0q4Tv7ttHBO26H37Uxm1ua6oyz7Lj942c8ss6wmcX0sSmQJgx3Cm	2025-06-17 17:46:35.054	2025-06-17 17:46:35.054
610ac040-e663-414b-bec7-49dbb705a231	Regina Dias	regina@teste.com	$2b$08$/kRZjYh02hChErdow0MDCO6nDEPBFD8Q2EfVxTopZ1sIEI5.lVr5K	2025-06-17 17:49:41.026	2025-06-17 17:49:41.026
736897e5-1e90-452e-9db5-daf6bb142ea7	Enzo Schmitt Lima	enzo@teste.com	$2b$08$Qwvvcm6NtX.gf9mUiBtlBuIQWotAlOm3exckFMQkNSTUpEfe8fOSe	2025-06-23 11:08:02.818	2025-06-23 11:08:02.818
5b0078be-2013-48f0-be2a-8b0d93502c01	Enzo	enzo2@teste.com	$2b$08$ZOuFO4VfqehJ8vIOvUVNj.3G7/Tsm5S0KVqQDMImO/48ufVntDHlq	2025-06-23 19:00:40.723	2025-06-23 19:00:40.723
420ed2c7-8531-4d5e-ae0a-2e184fa050a8	enzooo	nz@teste.com	$2b$08$QYxZkdAllKmhagb9Pe77g.ednrupKLWOn850bWOa8u0XpmBQiOlaa	2025-06-23 19:37:15.973	2025-06-23 19:37:15.973
6f0acc5a-2f83-4680-a817-0081e0433ce6	Tomás	tomas@teste.com	$2b$08$0pull4VrgNCwmJHLp/PtSuNjm3omLPhCi/tDieDwdcEuKL8bWmBQi	2025-06-24 10:46:48.504	2025-06-24 10:46:48.504
c2e6586d-8115-4d18-8622-27654c9cb1dd	Brenda	brenda@teste.com	$2b$08$kMlnNxM3dcavP9zIjUXhA.sIHn24GJg83ebNtVMdurvgnrMXa0XvK	2025-06-24 10:56:04.819	2025-06-24 10:56:04.819
cd809073-6b78-45d5-9af4-d8a4d32cea13	João villa	JoaoVilla@teste.com	$2b$08$Nv43RuYgI7Ic0yxyZjo3Yeam8sC2D7ggGbKkACjlUx1.zRoHrGmnm	2025-08-19 17:06:37.844	2025-08-19 17:06:37.844
3a959db5-ff4d-4e12-9e06-471b70377c4b	Tênis	tenis@teste.com	$2b$08$eog4uyDm08pcUcIWKb/cZutY9OeSgmzsMHQpRD/rsp0IsmlScmCru	2025-09-02 16:22:28.416	2025-09-02 16:22:28.416
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: items items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: items items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

