import { StyleSheet } from 'react-native';
import { getUserAvatarNameColor } from '../../utils';
const styles = ({ message, theme, user, }) => StyleSheet.create({
    descriptionText: {
        ...((user === null || user === void 0 ? void 0 : user.id) === message.author.id
            ? theme.fonts.sentMessageLinkDescriptionTextStyle
            : theme.fonts.receivedMessageLinkDescriptionTextStyle),
        marginTop: 4,
    },
    headerText: {
        ...theme.fonts.userNameTextStyle,
        color: getUserAvatarNameColor(message.author, theme.colors.userAvatarNameColors),
        marginBottom: 6,
    },
    titleText: (user === null || user === void 0 ? void 0 : user.id) === message.author.id
        ? theme.fonts.sentMessageLinkTitleTextStyle
        : theme.fonts.receivedMessageLinkTitleTextStyle,
    text: (user === null || user === void 0 ? void 0 : user.id) === message.author.id
        ? theme.fonts.sentMessageBodyTextStyle
        : theme.fonts.receivedMessageBodyTextStyle,
    textContainer: {
        marginHorizontal: theme.insets.messageInsetsHorizontal,
        marginVertical: theme.insets.messageInsetsVertical,
    },
});
export default styles;
//# sourceMappingURL=styles.js.map