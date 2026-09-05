'use client'

import { useEffect, useState } from 'react'
import styles from './profiles.module.css'
import { profileService } from '@/lib/services/profileService'

export default function ProfilesAdmin() {

    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(false)

    const [filters, setFilters] = useState({
        role: '',
        username: '',
        full_name: '',
        created_at: '',
    })

    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({
        role: '',
        username: '',
        full_name: '',
    })

    const fetchProfiles = async () => {
        try {
            setLoading(true)

            const profilesList = await profileService.getAllProfiles()
            setProfiles(profilesList)

        } catch (error) {
            console.error('Error fetching profile list:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfiles()
    }, [])

    const handleFilterChange = (column, value) => {
        setFilters(prev => ({
            ...prev,
            [column]: value,
        }))
    }

    const filteredProfiles = profiles.filter(profile => {
        const username = profile.username?.toLowerCase() ?? ''
        const fullName = profile.full_name?.toLowerCase() ?? ''
        const role = profile.role?.toLowerCase() ?? ''

        const createdAt = profile.created_at
            ? new Date(profile.created_at).toLocaleDateString('es-ES')
            : ''

        return (
            role.includes(filters.role.toLowerCase()) &&
            username.includes(filters.username.toLowerCase()) &&
            fullName.includes(filters.full_name.toLowerCase()) &&
            createdAt.includes(filters.created_at)
        )
    })

    const clearFilters = () => {
        setFilters({
            role: '',
            username: '',
            full_name: '',
            created_at: '',
        })
    }

    const startEditing = (profile) => {
        setEditingId(profile.id)

        setEditData({
            role: profile.role ?? '',
            username: profile.username ?? '',
            full_name: profile.full_name ?? '',
        })
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditData({
            role: '',
            username: '',
            full_name: '',
        })
    }

    const handleEditChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const saveEdit = async (id) => {
        try {
            await profileService.updateProfile(id, editData)

            setProfiles(prev =>
                prev.map(profile =>
                    profile.id === id
                        ? {
                            ...profile,
                            ...editData,
                        }
                        : profile
                )
            )

            cancelEditing()

        } catch (error) {
            console.error('Error updating profile:', error)
            alert('No se ha podido actualizar el perfil')
        }
    }

    const deleteProfile = async (id) => {
        const confirmed = window.confirm(
            '¿Seguro que quieres eliminar este perfil? Esta acción no se puede deshacer.'
        )

        if (!confirmed) {
            return
        }

        try {
            await profileService.deleteProfile(id)

            setProfiles(prev =>
                prev.filter(profile => profile.id !== id)
            )

        } catch (error) {
            console.error('Error deleting profile:', error)
            alert('No se ha podido eliminar el perfil')
        }
    }

    return (
        <div className={styles.container}>
            <h2>Administrar perfiles</h2>

            <button
                className={styles.clearFilters}
                onClick={clearFilters}
            >
                Limpiar filtros
            </button>

            <div className={styles.profilesList}>

                <div className={styles.header}>
                    <div>
                        <span>Rol</span>

                        <select
                            value={filters.role}
                            onChange={e =>
                                handleFilterChange('role', e.target.value)
                            }
                        >
                            <option value="">Todos</option>
                            <option value="admin">Admin</option>
                            <option value="user">Usuario</option>
                        </select>
                    </div>

                    <div>
                        <span>Nombre Drag</span>

                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={filters.username}
                            onChange={e =>
                                handleFilterChange('username', e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <span>Nombre</span>

                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={filters.full_name}
                            onChange={e =>
                                handleFilterChange('full_name', e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <span>Creado</span>

                        <input
                            type="text"
                            placeholder="dd/mm/aaaa"
                            value={filters.created_at}
                            onChange={e =>
                                handleFilterChange('created_at', e.target.value)
                            }
                        />
                    </div>

                    <span>Acciones</span>
                </div>

                {loading ? (
                    <p className={styles.loading}>Cargando...</p>
                ) : filteredProfiles.length === 0 ? (
                    <p className={styles.empty}>
                        No hay perfiles que coincidan con los filtros.
                    </p>
                ) : (
                    filteredProfiles.map(profile => (
                        <div
                            key={profile.id}
                            className={styles.profile}
                        >
                            {editingId === profile.id ? (
                                <>
                                    <select
                                        value={editData.role}
                                        onChange={e =>
                                            handleEditChange(
                                                'role',
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">Usuario</option>
                                    </select>

                                    <input
                                        type="text"
                                        value={editData.username}
                                        onChange={e =>
                                            handleEditChange(
                                                'username',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        type="text"
                                        value={editData.full_name}
                                        onChange={e =>
                                            handleEditChange(
                                                'full_name',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <span className={styles.date}>
                                        {new Date(
                                            profile.created_at
                                        ).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </span>

                                    <div className={styles.actions}>
                                        <button
                                            className={styles.saveButton}
                                            onClick={() =>
                                                saveEdit(profile.id)
                                            }
                                        >
                                            Guardar
                                        </button>

                                        <button
                                            className={styles.cancelButton}
                                            onClick={cancelEditing}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className={styles.role}>
                                        {profile.role}
                                    </span>

                                    <span className={styles.username}>
                                        {profile.username}
                                    </span>

                                    <span>
                                        {profile.full_name || '—'}
                                    </span>

                                    <span className={styles.date}>
                                        {new Date(
                                            profile.created_at
                                        ).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </span>

                                    <div className={styles.actions}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() =>
                                                startEditing(profile)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className={styles.deleteButton}
                                            onClick={() =>
                                                deleteProfile(profile.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}