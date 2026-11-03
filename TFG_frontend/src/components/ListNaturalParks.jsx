import React, { useEffect, useState } from 'react';
import NaturalParkService from '../service/NaturalParkService';
import Search from './Search';
import Modal from './Modal';

const ListNaturalParks = () => {
    const [naturalParks, setNaturalParks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [parkToDelete, setParkToDelete] = useState(null);

    useEffect(() => {
        listNaturalParks();
    }, []);


    const listNaturalParks = () => {
        NaturalParkService.getAllNaturalParks()
            .then(response => {
                setNaturalParks(response.data);
            })
            .catch(error => {
                console.log(error);
                setError('No se han podido cargar los parques naturales.');
            })
            .finally(() => setLoading(false));
    };

    const deleteNaturalPark = (naturalParkId) => {
        NaturalParkService.deleteNaturalPark(naturalParkId)
            .then(() => {
                listNaturalParks();
            })
            .catch(error => {
                console.log(error);
                setError(error.response?.status === 403
                    ? 'No tienes permisos para eliminar parques.'
                    : 'No se ha podido eliminar el parque.');
            })
            .finally(() => setParkToDelete(null));
    };

    const filteredNaturalParks = naturalParks.filter(naturalPark =>
        naturalPark.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="eyebrow">Administración</p>
                    <h1 className="mt-3 text-4xl font-medium sm:text-5xl">Gestión de parques</h1>
                </div>
                <a href="/addPark" className="btn-primary shrink-0">
                    <span aria-hidden="true" className="text-base leading-none">+</span> Añadir parque
                </a>
            </div>

            {error && (
                <div className="mt-6 rounded-2xl border border-clay-500/25 bg-clay-50 px-5 py-3 text-sm text-clay-600">{error}</div>
            )}

            <div className="card mt-8 overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-pine-900/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-pine-900/60">
                        {loading ? 'Cargando…' : `${filteredNaturalParks.length} de ${naturalParks.length} parques`}
                    </p>
                    <Search onSearch={setSearchTerm} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-paper-50 text-xs uppercase tracking-wider text-pine-900/50">
                            <tr>
                                <th className="px-5 py-3 font-semibold">ID</th>
                                <th className="px-5 py-3 font-semibold">Nombre</th>
                                <th className="px-5 py-3 font-semibold">Provincia</th>
                                <th className="hidden px-5 py-3 font-semibold md:table-cell">Perímetro</th>
                                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pine-900/5">
                            {filteredNaturalParks.map(park => (
                                <tr key={park.id} className="transition-colors hover:bg-pine-50/50">
                                    <td className="px-5 py-3.5 tabular-nums text-pine-900/45">{park.id}</td>
                                    <td className="px-5 py-3.5 font-medium text-pine-950">{park.name}</td>
                                    <td className="px-5 py-3.5 text-pine-900/70">{park.province}</td>
                                    <td className="hidden px-5 py-3.5 font-mono text-xs text-pine-900/50 md:table-cell">{park.perimeterfile}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex justify-end gap-2">
                                            <a href={`/editPark/${park.id}`} className="btn-secondary btn-sm">Editar</a>
                                            <button className="btn-danger btn-sm" onClick={() => setParkToDelete(park)}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredNaturalParks.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-pine-900/50">No hay parques que coincidan con la búsqueda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                open={!!parkToDelete}
                onClose={() => setParkToDelete(null)}
                title="¿Eliminar este parque?"
                footer={
                    <>
                        <button type="button" className="btn-secondary" onClick={() => setParkToDelete(null)}>Cancelar</button>
                        <button type="button" className="btn bg-clay-500 text-white hover:bg-clay-600" onClick={() => deleteNaturalPark(parkToDelete.id)}>
                            Eliminar
                        </button>
                    </>
                }
            >
                <p className="leading-relaxed text-pine-900/70">
                    Se eliminará <strong className="font-semibold text-pine-950">{parkToDelete?.name}</strong> de la base de datos. Esta acción no se puede deshacer.
                </p>
            </Modal>
        </div>
    );
};

export default ListNaturalParks;
