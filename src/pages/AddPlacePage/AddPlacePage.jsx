import { useState, useCallback, useMemo } from 'react'
import { Container, Input, Button, buttonType, Text, LinkButton, ImagePanel } from '../../components'
import cls from './AddPlacePage.module.scss'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import $api, { API_URL } from '../../api'
import { useStore } from '../../store/StoreProvider'
import { observerFinalizationRegistry } from 'mobx-react-lite/dist/utils/observerFinalizationRegistry'

export const AddPlacePage = () => {
    const { placeStore } = useStore()
    const [valueEditor, setValueEditor] = useState('')
    const [title, setTitle] = useState('')
    const [img, setImg] = useState('')
    const [gallery, setGallery] = useState('')
    const [isNewPlace, setIsNewPlace] = useState(false)
    const [placeId, setPlaceId] = useState(null)
    
    const submitPlace = async () => {
        try{
            const formData = new FormData()
            formData.append('thumbnail', img)
            gallery.map((file) => {
                formData.append('gallery', file)
            })
            const { data } = await $api.post(`${API_URL}/upload/images`, data.thumbUrl)
            const places = await placeStore.getPlaces()
            setPlaceId(places[places.length - 1].id)
            setIsNewPlace(true)
        }   catch(error) {
                console.warn(error)
        }
    }

    const onChangeEditor = useCallback((value) => {
        setValueEditor(value)
    }, [])

    const onChangeTitle = useCallback((value) => {
        setTitle(value)
    }, [])

    const options = useMemo (() => {
        return {
            autofocus: true,
            spellChecker: false,
            maxHeight: '400px',
            placeholder: 'Описание достоприместальности',
            status: false,
            hideIcons: ['fullscreen', 'side-by-side'],
            forceSync: true
        }
    }, [])

    return (
        <div className={cls.addPlaceInner}>
            <Container>
                <Text title='Добавить достопримечательность' size='m'/>
                <br />
                <Input  
                    className={cls.input}
                    placeholder='Название достопримечательности'
                    value={title}
                    onChange={onChangeTitle}
                />
                <SimpleMDE 
                    className={cls.editor}
                    value={valueEditor}
                    onChange={onChangeEditor}
                    options={options}
                />

                <ImagePanel setImg={setImg} setGallery={setGallery} gallery={gallery} />
                <div className={cls.buttons}>
                    <Button onClick={submitPlace} variant={buttonType.FILLED}>
                        Опубликовать
                    </Button>
                    <LinkButton to={'/#places'} variant={buttonType.GRADIENT}>
                        Отмена
                    </LinkButton>
                    {
                        isNewPlace &&
                            <LinkButton 
                                to={`/places/${placeId}`}    
                                variant={buttonType.FILLED}
                            >
                                Посмотреть созданную достопремечательность
                            </LinkButton>
                    }
                </div>
            </Container>
        </div>
    )
}