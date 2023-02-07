import { Text } from '@mantine/core'
import { useModals } from '@mantine/modals'

/**
 * 確認モーダル
 * @param confirmAcrion
 */
export const useConfirmModal = <T extends {}[]>(confirmAcrion: (items: T) => Promise<void>) => {
    const modals = useModals()

    const deleteModal = (items: T) => {
        modals.openConfirmModal(
            {
                title: '削除確認',
                children: (
                    <Text size="sm">選択したアイテムを削除しますか？</Text>
                ),
                labels: { confirm: '削除する', cancel: '閉じる' },
                confirmProps: { color: 'red' },
                onConfirm: () => confirmAcrion(items)
            })
    }

    return {
        deleteModal
    }
}
